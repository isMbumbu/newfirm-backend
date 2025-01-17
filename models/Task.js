const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Ensure the path is correct

const Task = sequelize.define('Task', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Task;
