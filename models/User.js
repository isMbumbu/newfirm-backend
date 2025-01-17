// models/User.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,   // Prevents Sequelize from pluralizing the table name
  tableName: 'users',      // Explicitly sets the table name to 'users' in lowercase
  underscored: true,       // Optionally convert column names to snake_case
});

module.exports = User;
