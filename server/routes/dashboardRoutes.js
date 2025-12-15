const express = require('express');
const router = express.Router();
const { getDashboardData, syncDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getDashboardData);
router.post('/sync', protect, admin, syncDashboardStats);

module.exports = router;
