const { Webinar, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all webinars
// @route   GET /api/webinars
// @access  Private
exports.getWebinars = async (req, res) => {
  try {
    const { search, isActive } = req.query;
    const where = {};

    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const webinars = await Webinar.findAll({
      where,
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['date', 'ASC']]
    });

    res.json(webinars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get webinar by ID
// @route   GET /api/webinars/:id
// @access  Private
exports.getWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    res.json(webinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create webinar
// @route   POST /api/webinars
// @access  Private/Alumni
exports.createWebinar = async (req, res) => {
  try {
    if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only alumni can organize webinars' });
    }

    const webinar = await Webinar.create({
      ...req.body,
      organizerId: req.user.id
    });

    const webinarWithOrganizer = await Webinar.findByPk(webinar.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json(webinarWithOrganizer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update webinar
// @route   PUT /api/webinars/:id
// @access  Private
exports.updateWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByPk(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await webinar.update(req.body);

    const updatedWebinar = await Webinar.findByPk(webinar.id, {
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json(updatedWebinar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete webinar
// @route   DELETE /api/webinars/:id
// @access  Private
exports.deleteWebinar = async (req, res) => {
  try {
    const webinar = await Webinar.findByPk(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: 'Webinar not found' });
    }

    if (webinar.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await webinar.destroy();

    res.json({ message: 'Webinar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
