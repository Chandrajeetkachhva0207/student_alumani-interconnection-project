const { User, Student, Alumni, Admin, Connection } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { role, search, isApproved } = req.query;
    const where = {};

    if (role) where.role = role;
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Alumni, required: false },
        { model: Admin, required: false }
      ],
      limit: 50
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Alumni, required: false },
        { model: Admin, required: false }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow users to update their own profile or admin to update any
    if (req.user.id !== user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { firstName, lastName, profilePicture, ...otherData } = req.body;

    await user.update({ firstName, lastName, profilePicture });

    // Update role-specific profile
    if (user.role === 'student') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) await student.update(otherData);
    } else if (user.role === 'alumni') {
      const alumni = await Alumni.findOne({ where: { userId: user.id } });
      if (alumni) await alumni.update(otherData);
    }

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Alumni, required: false }
      ]
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { q, role } = req.query;
    const where = {
      isActive: true,
      isApproved: true,
      id: { [Op.ne]: req.user.id }
    };

    if (role) where.role = role;
    if (q) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${q}%` } },
        { lastName: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [
        { model: Student, required: false },
        { model: Alumni, required: false }
      ],
      limit: 20
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Connect with user
// @route   POST /api/users/:id/connect
// @access  Private
exports.connectUser = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id);
    const userId = req.user.id;

    if (targetUserId === userId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { userId1: userId, userId2: targetUserId },
          { userId1: targetUserId, userId2: userId }
        ]
      }
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }

    const connection = await Connection.create({
      userId1: userId,
      userId2: targetUserId,
      initiatedBy: userId,
      status: 'pending'
    });

    res.status(201).json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept connection
// @route   PUT /api/users/connections/:id/accept
// @access  Private
exports.acceptConnection = async (req, res) => {
  try {
    const connection = await Connection.findByPk(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    if (connection.userId2 !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
