const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Banner = sequelize.define('Banner', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subtitle: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    placement: {
        type: DataTypes.STRING,
        allowNull: false,
        // Enum-like validation can be handled here or in controller
        // 'home_hero', 'home_promo', 'collection_hero', 'deals_hero', 'about_hero', 'custom'
    },
    layout: {
        type: DataTypes.ENUM('full_width_image', 'split_image_text', 'centered_card'),
        defaultValue: 'full_width_image',
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    mobileImageUrl: {
        type: DataTypes.STRING,
    },
    link: {
        type: DataTypes.STRING,
    },
    linkText: {
        type: DataTypes.STRING,
    },
    openInNewTab: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('draft', 'active', 'archived'),
        defaultValue: 'draft',
    },
    startsAt: {
        type: DataTypes.DATE,
    },
    endsAt: {
        type: DataTypes.DATE,
    },
    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
    },
}, {
    timestamps: true,
});

module.exports = Banner;
