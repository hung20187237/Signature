const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const DashboardDailyStat = require('../models/DashboardDailyStat');

const { syncStatsService } = require('../services/dashboardService');

// @desc    Sync dashboard daily stats (Calculate from Orders & Users)
// @route   POST /api/dashboard/sync
// @access  Private/Admin
const syncDashboardStats = async (req, res) => {
    try {
        const count = await syncStatsService();
        if (res) res.json({ message: 'Dashboard stats synced successfully', count });
        return count;
    } catch (error) {
        console.error('Sync Error:', error);
        if (res) res.status(500).json({ message: 'Sync failed' });
    }
};

// @desc    Get consolidated dashboard data
// @route   GET /api/dashboard
// @access  Private/Admin
const getDashboardData = async (req, res) => {
    try {
        const { range } = req.query;
        let startDate, previousStartDate, previousEndDate;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // 1. Determine Date Ranges
        if (range === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
            previousStartDate = new Date(new Date(startDate).setDate(startDate.getDate() - 1));
            previousEndDate = new Date(startDate);
        } else if (range === 'last_7_days') {
            startDate = new Date(new Date().setDate(new Date().getDate() - 7));
            previousStartDate = new Date(new Date(startDate).setDate(startDate.getDate() - 7));
            previousEndDate = new Date(startDate);
        } else if (range === 'last_90_days') {
            startDate = new Date(new Date().setDate(new Date().getDate() - 90));
            previousStartDate = new Date(new Date(startDate).setDate(startDate.getDate() - 90));
            previousEndDate = new Date(startDate);
        } else {
            // Default: last_30_days
            startDate = new Date(new Date().setDate(new Date().getDate() - 30));
            previousStartDate = new Date(new Date(startDate).setDate(startDate.getDate() - 30));
            previousEndDate = new Date(startDate);
        }

        const startDateStr = startDate.toISOString().split('T')[0];
        const previousStartDateStr = previousStartDate.toISOString().split('T')[0];
        const previousEndDateStr = previousEndDate.toISOString().split('T')[0];

        // 2. Fetch Cached Stats (Past Days)
        // We fetch stats from DashboardDailyStat for the range
        const cachedStats = await DashboardDailyStat.findAll({
            where: {
                date: { [Op.gte]: startDateStr }
            },
            raw: true
        });

        const previousCachedStats = await DashboardDailyStat.findAll({
            where: {
                date: {
                    [Op.gte]: previousStartDateStr,
                    [Op.lt]: previousEndDateStr
                }
            },
            raw: true
        });

        // 3. Calculate "Today" Live (if range includes today)
        // Since cached stats might not include today (or be stale), we calculate today live
        // and merge it if it's not already in cachedStats (or overwrite it)
        const todayFilter = {
            createdAt: {
                [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
            }
        };

        const todayOrders = await Order.findAll({
            where: {
                ...todayFilter,
                paymentStatus: 'Paid',
                orderStatus: { [Op.ne]: 'Cancelled' }
            },
            attributes: ['totalPrice']
        });

        const todayRevenue = todayOrders.reduce((sum, o) => sum + parseFloat(o.totalPrice || 0), 0);
        const todayOrderCount = todayOrders.length;
        const todayNewCustomers = await User.count({ where: { ...todayFilter, role: 'user' } });

        const todayStat = {
            date: todayStr,
            totalRevenue: todayRevenue,
            totalOrders: todayOrderCount,
            newCustomers: todayNewCustomers
        };

        // Merge Today into Cached Stats
        // Remove existing today entry from cache if exists, then push live one
        const mergedStats = cachedStats.filter(s => s.date !== todayStr);
        if (range !== 'last_7_days' && range !== 'last_30_days' && range !== 'last_90_days') {
            // If range is specific, logic might differ, but for 'today' or 'last_X_days', we include today
        }
        // Actually, for 'last_X_days', we usually include today.
        mergedStats.push(todayStat);

        // Sort by date
        mergedStats.sort((a, b) => new Date(a.date) - new Date(b.date));

        // 4. Calculate Summary Metrics from Merged Stats
        const currentMetrics = mergedStats.reduce((acc, stat) => {
            acc.totalRevenue += parseFloat(stat.totalRevenue || 0);
            acc.totalOrders += parseInt(stat.totalOrders || 0);
            acc.newCustomers += parseInt(stat.newCustomers || 0);
            return acc;
        }, { totalRevenue: 0, totalOrders: 0, newCustomers: 0 });

        currentMetrics.aov = currentMetrics.totalOrders > 0 ? currentMetrics.totalRevenue / currentMetrics.totalOrders : 0;

        // Previous Period Metrics (Approximation using cached stats only)
        const previousMetrics = previousCachedStats.reduce((acc, stat) => {
            acc.totalRevenue += parseFloat(stat.totalRevenue || 0);
            acc.totalOrders += parseInt(stat.totalOrders || 0);
            acc.newCustomers += parseInt(stat.newCustomers || 0);
            return acc;
        }, { totalRevenue: 0, totalOrders: 0, newCustomers: 0 });

        previousMetrics.aov = previousMetrics.totalOrders > 0 ? previousMetrics.totalRevenue / previousMetrics.totalOrders : 0;

        const calculateChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const summary = {
            total_revenue: { value: currentMetrics.totalRevenue, change: calculateChange(currentMetrics.totalRevenue, previousMetrics.totalRevenue) },
            total_orders: { value: currentMetrics.totalOrders, change: calculateChange(currentMetrics.totalOrders, previousMetrics.totalOrders) },
            average_order_value: { value: currentMetrics.aov, change: calculateChange(currentMetrics.aov, previousMetrics.aov) },
            new_customers: { value: currentMetrics.newCustomers, change: calculateChange(currentMetrics.newCustomers, previousMetrics.newCustomers) }
        };

        // 5. Revenue Chart
        // Fill missing dates
        const revenue_chart = [];
        const dateMap = {};
        mergedStats.forEach(s => dateMap[s.date] = s.totalRevenue);

        for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dateStr = new Date(d).toISOString().split('T')[0];
            revenue_chart.push({
                date: dateStr,
                revenue: dateMap[dateStr] || 0
            });
        }

        // 6. Top Products & Recent Orders (Still need to query Orders directly as they are not in daily stats)
        // We could cache top products daily too, but user only asked for daily stats table.
        // We'll keep the existing logic for Top Products & Recent Orders but scoped to the range.

        // Fetching orders for Top Products (only if needed, optimization: fetch only IDs and Items)
        const currentOrdersForProducts = await Order.findAll({
            where: {
                createdAt: { [Op.gte]: startDate },
                paymentStatus: 'Paid',
                orderStatus: { [Op.ne]: 'Cancelled' }
            },
            attributes: ['orderItems']
        });

        const productMap = {};
        currentOrdersForProducts.forEach(order => {
            const items = order.orderItems || [];
            items.forEach(item => {
                if (!productMap[item.id]) {
                    productMap[item.id] = { product_id: item.id, name: item.name, orders: 0, revenue: 0 };
                }
                productMap[item.id].orders += (item.qty || item.quantity || 1);
                productMap[item.id].revenue += (item.price || 0) * (item.qty || item.quantity || 1);
            });
        });

        const top_products = Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent Orders
        const recent_orders_data = await Order.findAll({
            limit: 10,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['name', 'email'] }]
        });

        const recent_orders = recent_orders_data.map(o => ({
            order_id: o.id,
            order_number: `#${o.id}`,
            customer_name: o.User?.name || 'Guest',
            total_amount: o.totalPrice,
            payment_status: o.paymentStatus,
            fulfillment_status: o.fulfillmentStatus,
            created_at: o.createdAt
        }));

        // 7. Alerts
        const alerts = [];
        const lowStockCount = await Product.count({ where: { stock: { [Op.lte]: 5 } } });
        if (lowStockCount > 0) alerts.push({ type: 'low_stock', message: `${lowStockCount} products are low in stock (<= 5 units).` });

        // Refund Rate (Approximate using cached stats if available, or just live query for simplicity)
        // Let's use live query for accuracy on the current period
        const refundedOrdersCount = await Order.count({
            where: {
                createdAt: { [Op.gte]: startDate },
                [Op.or]: [{ paymentStatus: 'Refunded' }, { paymentStatus: 'Partially Refunded' }]
            }
        });

        if (currentMetrics.totalOrders > 0) {
            const refundRate = (refundedOrdersCount / currentMetrics.totalOrders) * 100;
            if (refundRate > 5) alerts.push({ type: 'high_refund_rate', message: `Refund rate is ${refundRate.toFixed(1)}% in this period (high).` });
        }

        res.json({
            range,
            summary,
            revenue_chart,
            top_products,
            recent_orders,
            alerts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardData,
    syncDashboardStats
};
