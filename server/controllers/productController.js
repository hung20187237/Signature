const Product = require('../models/Product');
const { Op } = require('sequelize');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.pageNumber) || 1;

        const where = req.query.keyword
            ? {
                name: {
                    [Op.like]: `%${req.query.keyword}%`
                }
            }
            : {};

        const { count, rows: products } = await Product.findAndCountAll({
            where,
            limit: pageSize,
            offset: pageSize * (page - 1),
        });

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.destroy();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            name: 'Sample Name',
            price: 0,
            brand: 'Sample Brand',
            category: 'Sample Category',
            stock: 0,
            description: 'Sample description',
            handle: `sample-product-${Date.now()}`
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            images,
            brand,
            category,
            stock,
            variants,
            status,
            seo,
            handle
        } = req.body;

        const product = await Product.findByPk(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.images = images || product.images;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.variants = variants || product.variants;
            product.status = status || product.status;
            product.seo = seo || product.seo;
            product.handle = handle || product.handle;

            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};
