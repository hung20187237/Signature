const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('../models/Order');
const User = require('../models/User');
const DashboardDailyStat = require('../models/DashboardDailyStat');

const syncStatsService = async () => {
    // 1. Aggregate Orders by Date
    const orders = await Order.findAll({
        where: {
            paymentStatus: 'Paid',
            orderStatus: { [Op.ne]: 'Cancelled' }
        },
        attributes: [
            [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
            [sequelize.fn('sum', sequelize.col('totalPrice')), 'totalRevenue'],
            [sequelize.fn('count', sequelize.col('id')), 'totalOrders']
        ],
        group: [sequelize.fn('date', sequelize.col('createdAt'))],
        raw: true
    });

    // 2. Aggregate New Customers by Date
    const customers = await User.findAll({
        where: { role: 'user' },
        attributes: [
            [sequelize.fn('date', sequelize.col('createdAt')), 'date'],
            [sequelize.fn('count', sequelize.col('id')), 'newCustomers']
        ],
        group: [sequelize.fn('date', sequelize.col('createdAt'))],
        raw: true
    });

    // 3. Merge Data
    const statsMap = {};

    orders.forEach(o => {
        const date = o.date;
        if (!statsMap[date]) statsMap[date] = { date, totalRevenue: 0, totalOrders: 0, newCustomers: 0, refundAmount: 0 };
        statsMap[date].totalRevenue = parseFloat(o.totalRevenue || 0);
        statsMap[date].totalOrders = parseInt(o.totalOrders || 0);
    });

    customers.forEach(c => {
        const date = c.date;
        if (!statsMap[date]) statsMap[date] = { date, totalRevenue: 0, totalOrders: 0, newCustomers: 0, refundAmount: 0 };
        statsMap[date].newCustomers = parseInt(c.newCustomers || 0);
    });

    // 4. Bulk Upsert
    const statsArray = Object.values(statsMap);
    for (const stat of statsArray) {
        await DashboardDailyStat.upsert(stat);
    }

    return statsArray.length;
};

module.exports = {
    syncStatsService
};
