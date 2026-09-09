const express = require('express');
const router = express.Router();
const {
  getMentorships,
  getMentorship,
  requestMentorship,
  updateMentorship
} = require('../controllers/mentorshipController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getMentorships);
router.get('/:id', protect, getMentorship);
router.post('/', protect, requestMentorship);
router.put('/:id', protect, updateMentorship);

module.exports = router;
