const express = require('express');
const router = express.Router();
const {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  pinDiscussion,
  lockDiscussion
} = require('../controllers/discussionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getDiscussions);
router.get('/:id', protect, getDiscussion);
router.post('/', protect, createDiscussion);
router.put('/:id', protect, updateDiscussion);
router.delete('/:id', protect, deleteDiscussion);
router.put('/:id/pin', protect, authorize('admin'), pinDiscussion);
router.put('/:id/lock', protect, authorize('admin'), lockDiscussion);

module.exports = router;
