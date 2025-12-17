const { sequelize } = require('./config/db');
const Order = require('./models/Order');
const User = require('./models/User');

const fixIntegrity = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // Find orders with invalid userIds
        // We need to fetch all orders and users to compare because fetching with include might fail if constraints are broken (though findAll usually works)
        const orders = await Order.findAll();
        const users = await User.findAll();

        console.log(`Total Orders: ${orders.length}`);
        console.log(`Total Users: ${users.length}`);

        const userIds = new Set(users.map(u => u.id));
        const orphanOrders = orders.filter(o => o.userId && !userIds.has(o.userId));

        if (orphanOrders.length > 0) {
            console.log(`Found ${orphanOrders.length} orphan orders. Deleting...`);
            const orphanIds = orphanOrders.map(o => o.id);
            await Order.destroy({ where: { id: orphanIds } });
            console.log('Orphan orders deleted.');
        } else {
            console.log('No orphan orders found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

fixIntegrity();
