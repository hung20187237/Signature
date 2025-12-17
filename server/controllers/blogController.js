const BlogPost = require('../models/BlogPost');
const BlogCategory = require('../models/BlogCategory');
const BlogTag = require('../models/BlogTag');
const { Op } = require('sequelize');

// --- Helper: Generate Slug ---
const generateSlug = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

// --- POSTS ---

// Public: Get List
exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, q } = req.query;
        const offset = (page - 1) * limit;

        const where = {
            status: 'published',
            [Op.or]: [
                { publishedAt: null },
                { publishedAt: { [Op.lte]: new Date() } }
            ]
        };

        if (q) {
            where[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { content: { [Op.like]: `%${q}%` } }
            ];
        }

        const include = [
            { model: BlogCategory, as: 'category' },
            { model: BlogTag, as: 'tags' }
        ];

        if (category) {
            include[0].where = { slug: category }; // Filter by category slug
            // Note: If category slug doesn't match, the post won't be returned (INNER JOIN behavior on where clause)
        }

        if (tag) {
            include[1].where = { slug: tag };
        }

        const { count, rows } = await BlogPost.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['publishedAt', 'DESC']],
            distinct: true // Important for correct count with includes
        });

        res.json({
            posts: rows,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Public: Get Single by Slug
exports.getPostBySlug = async (req, res) => {
    try {
        const post = await BlogPost.findOne({
            where: {
                slug: req.params.slug,
                status: 'published',
                [Op.or]: [
                    { publishedAt: null },
                    { publishedAt: { [Op.lte]: new Date() } }
                ]
            },
            include: [
                { model: BlogCategory, as: 'category' },
                { model: BlogTag, as: 'tags' }
            ]
        });

        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get List (All Status)
exports.getAdminPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, q } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (status) where.status = status;
        if (q) where.title = { [Op.like]: `%${q}%` };

        const { count, rows } = await BlogPost.findAndCountAll({
            where,
            include: [{ model: BlogCategory, as: 'category' }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            posts: rows,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get Single by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await BlogPost.findByPk(req.params.id, {
            include: [
                { model: BlogCategory, as: 'category' },
                { model: BlogTag, as: 'tags' }
            ]
        });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Create Post
exports.createPost = async (req, res) => {
    try {
        const { title, content, tagIds, ...otherFields } = req.body;
        const slug = req.body.slug || generateSlug(title);

        // Ensure slug is unique
        const existing = await BlogPost.findOne({ where: { slug } });
        if (existing) return res.status(400).json({ message: 'Slug already in use' });

        const post = await BlogPost.create({
            title,
            content,
            slug,
            ...otherFields
        });

        if (tagIds && tagIds.length > 0) {
            await post.setTags(tagIds);
        }

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Update Post
exports.updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findByPk(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const { tagIds, ...updates } = req.body;
        if (updates.slug && updates.slug !== post.slug) {
            const existing = await BlogPost.findOne({ where: { slug: updates.slug } });
            if (existing) return res.status(400).json({ message: 'Slug already in use' });
        }

        await post.update(updates);

        if (tagIds) {
            await post.setTags(tagIds);
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Delete Post
exports.deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findByPk(req.params.id);
        if (post) await post.destroy();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- CATEGORIES ---

exports.getCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const slug = req.body.slug || generateSlug(req.body.name);
        const category = await BlogCategory.create({ ...req.body, slug });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// --- TAGS ---

exports.getTags = async (req, res) => {
    try {
        const tags = await BlogTag.findAll();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTag = async (req, res) => {
    try {
        const slug = req.body.slug || generateSlug(req.body.name);
        const tag = await BlogTag.create({ ...req.body, slug });
        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
