const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CollectionRule = sequelize.define('CollectionRule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    collectionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Collections',
            key: 'id',
        },
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    operator: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = CollectionRule;
