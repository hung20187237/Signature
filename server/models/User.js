const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for guest users
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
    },
    isGuest: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    totalSpent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
    },
    totalOrders: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lastOrderAt: {
        type: DataTypes.DATE,
    },
    acceptsMarketing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpire: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// Instance method to match password
User.prototype.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
