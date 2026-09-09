const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Note: authorize('admin') ensures only admins can access analytics
router.get('/analytics', protect, authorize('admin'), adminController.getAnalytics);

module.exports = router;
