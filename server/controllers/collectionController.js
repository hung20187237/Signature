const { Op } = require('sequelize');
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const CollectionProduct = require('../models/CollectionProduct');
const CollectionRule = require('../models/CollectionRule');
const { sequelize } = require('../config/db');

// @desc    Get all collections (Admin)
// @route   GET /api/admin/collections
// @access  Private/Admin
const getCollections = async (req, res) => {
    try {
        const { q, type, status, isVisible, pageNumber, limit } = req.query;
        const page = Number(pageNumber) || 1;
        const pageSize = Number(limit) || 20;

        const where = {};
        if (q) {
            where.title = { [Op.like]: `%${q}%` };
        }
        if (type) {
            where.type = type;
        }
        if (status) {
            where.status = status;
        }
        if (isVisible !== undefined) {
            where.isVisible = isVisible === 'true';
        }

        const count = await Collection.count({ where });
        const collections = await Collection.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: pageSize * (page - 1),
            include: [{ model: CollectionProduct, as: 'productRelations', attributes: ['productId'] }] // Count products workaround
        });

        // Map to include product count
        const result = collections.map(c => {
            const json = c.toJSON();
            json.products_count = c.productRelations ? c.productRelations.length : 0; // Approximate for manual
            delete json.productRelations;
            return json;
        });

        res.json({
            collections: result,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a collection
// @route   POST /api/admin/collections
// @access  Private/Admin
const createCollection = async (req, res) => {
    try {
        const {
            title, handle, description, image, thumbnail, type,
            rules, matchPolicy, status, kind, isVisible,
            startsAt, endsAt, sortOrder, seoTitle, seoDescription
        } = req.body;

        const collectionExists = await Collection.findOne({ where: { handle } });
        if (collectionExists) {
            return res.status(400).json({ message: 'Collection handle already exists' });
        }

        const collection = await Collection.create({
            title,
            handle,
            description,
            image,
            thumbnail,
            type,
            matchPolicy: type === 'automatic' ? (matchPolicy || 'all') : 'all',
            status,
            kind,
            isVisible,
            startsAt,
            endsAt,
            sortOrder,
            seoTitle,
            seoDescription
        });

        if (type === 'automatic' && rules && rules.length > 0) {
            const ruleData = rules.map(r => ({
                collectionId: collection.id,
                field: r.field,
                operator: r.operator,
                value: r.value
            }));
            await CollectionRule.bulkCreate(ruleData);
        }

        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get collection by ID
// @route   GET /api/admin/collections/:id
// @access  Private/Admin
const getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id, {
            include: [{ model: CollectionRule, as: 'rules' }]
        });
        if (collection) {
            res.json(collection);
        } else {
            res.status(404).json({ message: 'Collection not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update collection
// @route   PUT /api/admin/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id);

        if (collection) {
            collection.title = req.body.title || collection.title;
            collection.handle = req.body.handle || collection.handle;
            collection.description = req.body.description !== undefined ? req.body.description : collection.description;
            collection.image = req.body.image || collection.image;
            collection.thumbnail = req.body.thumbnail || collection.thumbnail;
            collection.type = req.body.type || collection.type;
            collection.status = req.body.status || collection.status;
            collection.kind = req.body.kind || collection.kind;

            if (collection.type === 'automatic') {
                collection.matchPolicy = req.body.matchPolicy || collection.matchPolicy;

                // Update rules: Delete all and recreate (simplest strategy)
                if (req.body.rules) {
                    await CollectionRule.destroy({ where: { collectionId: collection.id } });
                    const ruleData = req.body.rules.map(r => ({
                        collectionId: collection.id,
                        field: r.field,
                        operator: r.operator,
                        value: r.value
                    }));
                    await CollectionRule.bulkCreate(ruleData);
                }
            } else {
                // If switching to manual, remove rules
                await CollectionRule.destroy({ where: { collectionId: collection.id } });
            }

            collection.isVisible = req.body.isVisible !== undefined ? req.body.isVisible : collection.isVisible;
            collection.startsAt = req.body.startsAt || collection.startsAt;
            collection.endsAt = req.body.endsAt || collection.endsAt;
            collection.sortOrder = req.body.sortOrder || collection.sortOrder;
            collection.seoTitle = req.body.seoTitle || collection.seoTitle;
            collection.seoDescription = req.body.seoDescription || collection.seoDescription;

            const updatedCollection = await collection.save();

            // Re-fetch to include rules
            const reFetched = await Collection.findByPk(collection.id, {
                include: [{ model: CollectionRule, as: 'rules' }]
            });

            res.json(reFetched);
        } else {
            res.status(404).json({ message: 'Collection not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete collection
// @route   DELETE /api/admin/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id);

        if (collection) {
            await collection.destroy(); // Cascades should handle rules/products if configured in DB, but Sequelize hooks might be needed if not.
            // Manually clean up rules/products just in case
            await CollectionRule.destroy({ where: { collectionId: collection.id } });
            await CollectionProduct.destroy({ where: { collectionId: collection.id } });

            res.json({ message: 'Collection removed' });
        } else {
            res.status(404).json({ message: 'Collection not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get collection by handle (Shop)
// @route   GET /api/collections/:handle
// @access  Public
const getCollectionByHandle = async (req, res) => {
    try {
        const collection = await Collection.findOne({
            where: { handle: req.params.handle, status: 'active', isVisible: true },
            include: [{ model: CollectionRule, as: 'rules' }]
        });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        const response = collection.toJSON();
        response.available_filters = ['brand', 'category', 'price', 'tag'];
        response.seo = {
            title: collection.seoTitle || collection.title,
            meta_description: collection.seoDescription || (collection.description ? collection.description.substring(0, 160) : '')
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper to build where clause from rules
const buildRulesWhereClause = (rules, matchPolicy) => {
    if (!rules || rules.length === 0) return {};

    const conditions = rules.map(rule => {
        const { field, operator, value } = rule;
        let sequelizeOp;
        switch (operator) {
            case 'equals': sequelizeOp = Op.eq; break;
            case 'not_equals': sequelizeOp = Op.ne; break;
            case 'gt': sequelizeOp = Op.gt; break;
            case 'gte': sequelizeOp = Op.gte; break;
            case 'lt': sequelizeOp = Op.lt; break;
            case 'lte': sequelizeOp = Op.lte; break;
            case 'contains': sequelizeOp = Op.substring; break;
            case 'starts_with': sequelizeOp = Op.startsWith; break;
            case 'ends_with': sequelizeOp = Op.endsWith; break;
            default: sequelizeOp = Op.eq;
        }

        if (field === 'price' || field === 'stock') {
            return { [field]: { [sequelizeOp]: Number(value) } };
        } else if (field === 'tag') {
            if (operator === 'equals' || operator === 'contains') {
                return { tags: { [Op.like]: `%${value}%` } };
            }
            return {};
        } else {
            return { [field]: { [sequelizeOp]: value } };
        }
    });

    if (matchPolicy === 'any') {
        return { [Op.or]: conditions };
    } else {
        return { [Op.and]: conditions };
    }
};

// @desc    Get products in collection (Shop & Admin)
// @route   GET /api/collections/:id/products
// @access  Public/Admin
const getCollectionProducts = async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id, {
            include: [{ model: CollectionRule, as: 'rules' }]
        });

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        let products;
        const { sort, pageNumber, limit, brand, category, price_min, price_max, tag } = req.query;
        const pageSize = Number(limit) || 12;
        const page = Number(pageNumber) || 1;

        // Sorting logic
        let order = [['createdAt', 'DESC']]; // Default
        if (sort === 'price-asc') order = [['price', 'ASC']];
        if (sort === 'price-desc') order = [['price', 'DESC']];
        if (sort === 'title-asc') order = [['name', 'ASC']];
        if (sort === 'title-desc') order = [['name', 'DESC']];
        if (sort === 'best-selling') order = [['isBestSeller', 'DESC']];
        if (sort === 'newest') order = [['createdAt', 'DESC']];

        if (!sort && collection.sortOrder) {
            if (collection.sortOrder === 'price-asc') order = [['price', 'ASC']];
            if (collection.sortOrder === 'price-desc') order = [['price', 'DESC']];
            if (collection.sortOrder === 'title-asc') order = [['name', 'ASC']];
            if (collection.sortOrder === 'title-desc') order = [['name', 'DESC']];
        }

        const additionalFilters = {};
        if (brand) additionalFilters.brand = brand;
        if (category) additionalFilters.category = category;
        if (price_min || price_max) {
            additionalFilters.price = {};
            if (price_min) additionalFilters.price[Op.gte] = Number(price_min);
            if (price_max) additionalFilters.price[Op.lte] = Number(price_max);
        }
        if (tag) {
            additionalFilters.tags = { [Op.like]: `%${tag}%` };
        }

        if (collection.type === 'manual') {
            const manualQuery = {
                include: [{
                    model: Collection,
                    as: 'collections',
                    where: { id: collection.id },
                    through: { attributes: ['position'] }
                }],
                where: additionalFilters,
                order,
                limit: pageSize,
                offset: pageSize * (page - 1),
            };

            if (collection.sortOrder === 'manual') {
                manualQuery.order = [[sequelize.literal('`collections->CollectionProduct`.`position`'), 'ASC']];
            }

            const result = await Product.findAndCountAll(manualQuery);

            res.json({
                products: result.rows,
                page,
                pages: Math.ceil(result.count / pageSize),
                total: result.count
            });

        } else {
            // Automatic: Build query from rules + additional filters
            const ruleFilters = buildRulesWhereClause(collection.rules, collection.matchPolicy);

            const finalWhere = {
                [Op.and]: [
                    ruleFilters,
                    additionalFilters
                ]
            };

            const count = await Product.count({ where: finalWhere });
            const result = await Product.findAll({
                where: finalWhere,
                order,
                limit: pageSize,
                offset: pageSize * (page - 1),
            });

            res.json({
                products: result,
                page,
                pages: Math.ceil(count / pageSize),
                total: count
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add products to manual collection (Bulk)
// @route   POST /api/admin/collections/:id/products
// @access  Private/Admin
const addProductsToCollection = async (req, res) => {
    try {
        const { productIds } = req.body;
        const collection = await Collection.findByPk(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.type !== 'manual') {
            return res.status(400).json({ message: 'Cannot manually add products to automatic collection' });
        }

        const maxPos = await CollectionProduct.max('position', { where: { collectionId: collection.id } }) || 0;

        const bulkData = productIds.map((pid, index) => ({
            collectionId: collection.id,
            productId: pid,
            position: maxPos + index + 1
        }));

        await CollectionProduct.bulkCreate(bulkData, { ignoreDuplicates: true });

        res.status(201).json({ message: 'Products added to collection' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove product from manual collection
// @route   DELETE /api/admin/collections/:id/products/:productId
// @access  Private/Admin
const removeProductFromCollection = async (req, res) => {
    try {
        const collection = await Collection.findByPk(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.type !== 'manual') {
            return res.status(400).json({ message: 'Cannot manually remove products from automatic collection' });
        }

        await CollectionProduct.destroy({
            where: {
                collectionId: collection.id,
                productId: req.params.productId
            }
        });

        res.json({ message: 'Product removed from collection' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reorder products in manual collection
// @route   PATCH /api/admin/collections/:id/products/order
// @access  Private/Admin
const reorderCollectionProducts = async (req, res) => {
    try {
        const { productIds } = req.body;
        const collectionId = req.params.id;

        await sequelize.transaction(async (t) => {
            const promises = productIds.map((productId, index) => {
                return CollectionProduct.update(
                    { position: index },
                    {
                        where: { collectionId, productId },
                        transaction: t
                    }
                );
            });
            await Promise.all(promises);
        });

        res.json({ message: 'Collection order updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update collection rules
// @route   PATCH /api/admin/collections/:id/rules
// @access  Private/Admin
const updateCollectionRules = async (req, res) => {
    try {
        const { rules, matchPolicy } = req.body;
        const collection = await Collection.findByPk(req.params.id);

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        if (collection.type !== 'automatic') {
            return res.status(400).json({ message: 'Cannot update rules for manual collection' });
        }

        collection.matchPolicy = matchPolicy || collection.matchPolicy;
        await collection.save();

        if (rules) {
            await CollectionRule.destroy({ where: { collectionId: collection.id } });
            const ruleData = rules.map(r => ({
                collectionId: collection.id,
                field: r.field,
                operator: r.operator,
                value: r.value
            }));
            await CollectionRule.bulkCreate(ruleData);
        }

        const updatedCollection = await Collection.findByPk(collection.id, {
            include: [{ model: CollectionRule, as: 'rules' }]
        });

        res.json(updatedCollection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCollections,
    createCollection,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getCollectionByHandle,
    getCollectionProducts,
    addProductsToCollection,
    removeProductFromCollection,
    reorderCollectionProducts,
    updateCollectionRules
};
