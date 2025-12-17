const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlogCategory = sequelize.define('BlogCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'blog_categories'
});

module.exports = BlogCategory;
