const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    handle: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specificType: {
        type: DataTypes.STRING,
    },
    characterSeries: {
        type: DataTypes.STRING,
    },
    // Pricing & Inventory
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    salePrice: {
        type: DataTypes.DECIMAL(10, 2),
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    // Media (JSON array)
    images: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    // Variants (JSON array)
    variants: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    // Status & Flags
    status: {
        type: DataTypes.ENUM('Active', 'Draft', 'Archived'),
        defaultValue: 'Draft',
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    isNewArrival: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isBestSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    onSale: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isClearance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // SEO (JSON object)
    seo: {
        type: DataTypes.JSON,
        defaultValue: {},
    },
    // Organization
    salesChannels: {
        type: DataTypes.JSON,
        defaultValue: ['Online Store'],
    },
}, {
    timestamps: true,
});

module.exports = Product;
