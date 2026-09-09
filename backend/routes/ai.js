const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Receiving text instead of audio for the free demo
router.post('/interview', protect, aiController.processInterviewTurn);

module.exports = router;
