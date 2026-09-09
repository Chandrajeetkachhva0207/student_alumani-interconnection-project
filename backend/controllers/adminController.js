const { User, Job, Event, Discussion } = require('../models');

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const pendingUsers = await User.count({ where: { isApproved: false } });
    const totalJobs = await Job.count({ where: { isActive: true } });
    const totalEvents = await Event.count();
    const totalDiscussions = await Discussion.count();

    res.json({
      totalUsers,
      pendingUsers,
      totalJobs,
      totalEvents,
      totalDiscussions
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Server error retrieving analytics' });
  }
};
