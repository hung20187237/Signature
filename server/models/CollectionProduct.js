const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CollectionProduct = sequelize.define('CollectionProduct', {
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
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['collectionId', 'productId'],
        },
    ],
});

module.exports = CollectionProduct;
