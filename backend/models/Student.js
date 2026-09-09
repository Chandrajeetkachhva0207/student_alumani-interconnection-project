const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  major: {
    type: DataTypes.STRING,
    allowNull: true
  },
  year: {
    type: DataTypes.ENUM('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'),
    allowNull: true
  },
  gpa: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  },
  interests: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('interests');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('interests', JSON.stringify(value));
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Student;
