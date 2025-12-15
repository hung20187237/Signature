const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Collection = sequelize.define('Collection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
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
    },
    image: {
        type: DataTypes.STRING, // banner_image_url
    },
    thumbnail: {
        type: DataTypes.STRING, // thumbnail_image_url
    },
    type: {
        type: DataTypes.ENUM('manual', 'automatic'),
        defaultValue: 'manual',
    },
    // Rules are now in CollectionRule model
    matchPolicy: {
        type: DataTypes.ENUM('all', 'any'),
        defaultValue: 'all',
    },
    status: {
        type: DataTypes.ENUM('active', 'draft', 'archived'),
        defaultValue: 'active',
    },
    kind: {
        type: DataTypes.STRING, // 'category', 'campaign', 'brand', 'special'
    },
    sortOrder: {
        type: DataTypes.STRING,
        defaultValue: 'best-selling',
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    publishedAt: {
        type: DataTypes.DATE,
    },
    startsAt: {
        type: DataTypes.DATE,
    },
    endsAt: {
        type: DataTypes.DATE,
    },
    seoTitle: {
        type: DataTypes.STRING,
    },
    seoDescription: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
});

module.exports = Collection;
