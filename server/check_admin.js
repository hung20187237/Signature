const { sequelize } = require('./config/db');
const User = require('./models/User');

const checkAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const user = await User.findOne({ where: { email: 'admin@bungu.store' } });

        if (user) {
            console.log('Admin User Found:');
            console.log(JSON.stringify(user.toJSON(), null, 2));
        } else {
            console.log('Admin user NOT found!');
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

checkAdmin();
