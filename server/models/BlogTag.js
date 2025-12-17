const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlogTag = sequelize.define('BlogTag', {
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
    }
}, {
    timestamps: true,
    tableName: 'blog_tags'
});

module.exports = BlogTag;
