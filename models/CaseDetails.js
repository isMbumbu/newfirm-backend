const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CaseDetails = sequelize.define('CaseDetails', {
  clientname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW, // Automatically set the timestamp to NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW, // Automatically set the timestamp to NOW
  }
});

module.exports = CaseDetails;
