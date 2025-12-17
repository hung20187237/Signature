const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BlogPost = sequelize.define('BlogPost', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    excerpt: {
        type: DataTypes.TEXT
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    thumbnailUrl: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    },
    publishedAt: {
        type: DataTypes.DATE
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    authorName: {
        type: DataTypes.STRING,
        defaultValue: 'Bungu Team'
    },
    seoTitle: {
        type: DataTypes.STRING
    },
    seoDescription: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    tableName: 'blog_posts'
});

module.exports = BlogPost;
