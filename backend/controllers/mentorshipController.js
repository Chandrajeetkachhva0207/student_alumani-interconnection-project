const { Mentorship, User, Student, Alumni } = require('../models');

// @desc    Get all mentorship requests
// @route   GET /api/mentorships
// @access  Private
exports.getMentorships = async (req, res) => {
  try {
    const where = {};

    if (req.user.role === 'student') {
      where.studentId = req.user.id;
    } else if (req.user.role === 'alumni') {
      where.alumniId = req.user.id;
    }

    const mentorships = await Mentorship.findAll({
      where,
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Student, required: false }]
        },
        {
          model: User,
          as: 'alumni',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Alumni, required: false }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mentorship by ID
// @route   GET /api/mentorships/:id
// @access  Private
exports.getMentorship = async (req, res) => {
  try {
    const mentorship = await Mentorship.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Student, required: false }]
        },
        {
          model: User,
          as: 'alumni',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [{ model: Alumni, required: false }]
        }
      ]
    });

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    if (mentorship.studentId !== req.user.id && mentorship.alumniId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(mentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request mentorship
// @route   POST /api/mentorships
// @access  Private/Student
exports.requestMentorship = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can request mentorship' });
    }

    const { alumniId, message } = req.body;

    const alumni = await User.findByPk(alumniId);
    if (!alumni || alumni.role !== 'alumni') {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    const alumniProfile = await Alumni.findOne({ where: { userId: alumniId } });
    if (alumniProfile && !alumniProfile.isAvailableForMentorship) {
      return res.status(400).json({ message: 'This alumni is not available for mentorship' });
    }

    // Check if request already exists
    const existingRequest = await Mentorship.findOne({
      where: {
        studentId: req.user.id,
        alumniId: alumniId
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Mentorship request already exists' });
    }

    const mentorship = await Mentorship.create({
      studentId: req.user.id,
      alumniId: alumniId,
      message: message || '',
      status: 'pending'
    });

    const mentorshipWithDetails = await Mentorship.findByPk(mentorship.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'alumni',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json(mentorshipWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mentorship status
// @route   PUT /api/mentorships/:id
// @access  Private
exports.updateMentorship = async (req, res) => {
  try {
    const mentorship = await Mentorship.findByPk(req.params.id);

    if (!mentorship) {
      return res.status(404).json({ message: 'Mentorship request not found' });
    }

    // Only alumni can accept/reject, or admin can update
    if (mentorship.alumniId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, startDate, endDate } = req.body;

    if (status) mentorship.status = status;
    if (startDate) mentorship.startDate = startDate;
    if (endDate) mentorship.endDate = endDate;

    await mentorship.save();

    const updatedMentorship = await Mentorship.findByPk(mentorship.id, {
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'alumni',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json(updatedMentorship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
