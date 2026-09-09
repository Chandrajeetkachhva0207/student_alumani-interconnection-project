const { Discussion, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Private
exports.getDiscussions = async (req, res) => {
  try {
    const { category, search, isPinned } = req.query;
    const where = {};

    if (category) where.category = category;
    if (isPinned !== undefined) where.isPinned = isPinned === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const discussions = await Discussion.findAll({
      where,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture']
        }
      ],
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get discussion by ID
// @route   GET /api/discussions/:id
// @access  Private
exports.getDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture']
        }
      ]
    });

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.create({
      ...req.body,
      authorId: req.user.id
    });

    const discussionWithAuthor = await Discussion.findByPk(discussion.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture']
        }
      ]
    });

    res.status(201).json(discussionWithAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
exports.updateDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await discussion.update(req.body);

    const updatedDiscussion = await Discussion.findByPk(discussion.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'profilePicture']
        }
      ]
    });

    res.json(updatedDiscussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    if (discussion.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await discussion.destroy();

    res.json({ message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pin/Unpin discussion
// @route   PUT /api/discussions/:id/pin
// @access  Private/Admin
exports.pinDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lock/Unlock discussion
// @route   PUT /api/discussions/:id/lock
// @access  Private/Admin
exports.lockDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.isLocked = !discussion.isLocked;
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
