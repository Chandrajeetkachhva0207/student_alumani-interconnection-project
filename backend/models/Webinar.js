const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Webinar = sequelize.define('Webinar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  topics: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('topics');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('topics', JSON.stringify(value));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Webinar;
