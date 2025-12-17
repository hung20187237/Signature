const { Op } = require('sequelize');
const Banner = require('../models/Banner');

// @desc    Get all banners (Admin - with filters)
// @route   GET /api/admin/banners
// @access  Private/Admin
const getBannersAdmin = async (req, res) => {
    try {
        const { placement, status, q, pageNumber, limit } = req.query;
        const page = Number(pageNumber) || 1;
        const pageSize = Number(limit) || 20;

        const where = {};
        if (placement) where.placement = placement;
        if (status) where.status = status;
        if (q) where.title = { [Op.like]: `%${q}%` };

        const count = await Banner.count({ where });
        const banners = await Banner.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: pageSize * (page - 1),
        });

        res.json({
            banners,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get banners by placement (Public)
// @route   GET /api/banners
// @access  Public
const getBannersPublic = async (req, res) => {
    try {
        const { placement } = req.query;
        if (!placement) {
            return res.status(400).json({ message: 'Placement is required' });
        }

        const now = new Date();
        const banners = await Banner.findAll({
            where: {
                placement,
                status: 'active',
                [Op.and]: [
                    {
                        [Op.or]: [
                            { startsAt: null },
                            { startsAt: { [Op.lte]: now } }
                        ]
                    },
                    {
                        [Op.or]: [
                            { endsAt: null },
                            { endsAt: { [Op.gte]: now } }
                        ]
                    }
                ]
            },
            order: [['priority', 'ASC'], ['createdAt', 'DESC']],
            logging: console.log
        });

        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create banner
// @route   POST /api/admin/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get banner by ID
// @route   GET /api/admin/banners/:id
// @access  Private/Admin
const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (banner) {
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (banner) {
            await banner.update(req.body);
            res.json(banner);
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByPk(req.params.id);
        if (banner) {
            await banner.destroy();
            res.json({ message: 'Banner deleted' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBannersAdmin,
    getBannersPublic,
    createBanner,
    getBannerById,
    updateBanner,
    deleteBanner
};
