const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public
router.get('/public', settingController.getPublicSettings);

// Admin
router.get('/admin', protect, admin, settingController.getAllSettings);
router.put('/admin/:group', protect, admin, settingController.updateSettings);

module.exports = router;
