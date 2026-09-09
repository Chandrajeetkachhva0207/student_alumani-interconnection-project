const sequelize = require('../config/database');
const User = require('./User');
const Student = require('./Student');
const Alumni = require('./Alumni');
const Admin = require('./Admin');
const Job = require('./Job');
const Event = require('./Event');
const Mentorship = require('./Mentorship');
const Webinar = require('./Webinar');
const Discussion = require('./Discussion');
const Connection = require('./Connection');

// Define associations
User.hasOne(Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Alumni, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Admin, { foreignKey: 'userId', onDelete: 'CASCADE' });

Student.belongsTo(User, { foreignKey: 'userId' });
Alumni.belongsTo(User, { foreignKey: 'userId' });
Admin.belongsTo(User, { foreignKey: 'userId' });

// Job associations
Job.belongsTo(User, { foreignKey: 'postedBy', as: 'poster' });
Alumni.hasMany(Job, { foreignKey: 'postedBy' });

// Event associations
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Alumni.hasMany(Event, { foreignKey: 'createdBy' });

// Mentorship associations
Mentorship.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Mentorship.belongsTo(User, { foreignKey: 'alumniId', as: 'alumni' });
Student.hasMany(Mentorship, { foreignKey: 'studentId' });
Alumni.hasMany(Mentorship, { foreignKey: 'alumniId' });

// Webinar associations
Webinar.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
Alumni.hasMany(Webinar, { foreignKey: 'organizerId' });

// Discussion associations
Discussion.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Discussion, { foreignKey: 'authorId' });

// Connection associations (many-to-many between users)
Connection.belongsTo(User, { foreignKey: 'userId1', as: 'user1' });
Connection.belongsTo(User, { foreignKey: 'userId2', as: 'user2' });

module.exports = {
  sequelize,
  User,
  Student,
  Alumni,
  Admin,
  Job,
  Event,
  Mentorship,
  Webinar,
  Discussion,
  Connection
};
