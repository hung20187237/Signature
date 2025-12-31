const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Setting = sequelize.define('Setting', {
    key: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT, // Stored as text, parsed based on type
        allowNull: true
    },
    group_name: {
        type: DataTypes.STRING, // 'general', 'storefront', 'email', etc.
        allowNull: false
    },
    value_type: {
        type: DataTypes.STRING, // 'string', 'boolean', 'int', 'json', 'url', 'email'
        allowNull: false,
        defaultValue: 'string'
    },
    is_public: {
        type: DataTypes.BOOLEAN, // If true, exposed to public API
        defaultValue: false
    }
}, {
    timestamps: true,
    tableName: 'settings'
});

module.exports = Setting;
