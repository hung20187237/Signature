const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tag = sequelize.define('Tag', {
    customerId: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    tag: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
}, {
    tableName: 'customer_tags',
    timestamps: true,
    updatedAt: false,
});

module.exports = Tag;
