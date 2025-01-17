const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Import the sequelize instance from db.js

class Admin extends Model {}

Admin.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,  
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: false,  // Disable timestamps
  });
  
  module.exports = Admin;
  