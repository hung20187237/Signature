const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const DashboardDailyStat = sequelize.define('DashboardDailyStat', {
    date: {
        type: DataTypes.DATEONLY, // 'YYYY-MM-DD'
        primaryKey: true,
        allowNull: false
    },
    totalRevenue: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    },
    totalOrders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    newCustomers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    refundAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'dashboard_daily_stats'
});

module.exports = DashboardDailyStat;
