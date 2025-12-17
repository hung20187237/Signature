const express = require('express');
const router = express.Router();
const {
    getBannersAdmin,
    getBannersPublic,
    createBanner,
    getBannerById,
    updateBanner,
    deleteBanner
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/', getBannersPublic); // Query: ?placement=home_hero

// Admin routes
router.use('/admin', protect, admin);
router.route('/admin')
    .get(getBannersAdmin)
    .post(createBanner);

router.route('/admin/:id')
    .get(getBannerById)
    .put(updateBanner)
    .delete(deleteBanner);

module.exports = router;
