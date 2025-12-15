const { sequelize } = require('../config/db');
const { syncStatsService } = require('../services/dashboardService');

const runSync = async () => {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        await sequelize.sync(); // Ensure tables exist
        console.log('Database connected and synced.');

        console.log('Starting daily stats sync...');
        const count = await syncStatsService();
        console.log(`Sync completed. Processed ${count} days.`);

        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};

runSync();
