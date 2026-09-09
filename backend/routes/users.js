const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  approveUser,
  blockUser,
  deleteUser,
  searchUsers,
  connectUser,
  acceptConnection
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', protect, searchUsers);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.put('/:id/approve', protect, authorize('admin'), approveUser);
router.put('/:id/block', protect, authorize('admin'), blockUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/:id/connect', protect, connectUser);
router.put('/connections/:id/accept', protect, acceptConnection);

module.exports = router;
