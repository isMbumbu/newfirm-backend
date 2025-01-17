const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust the path as necessary

class Document extends Model {}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures name cannot be null
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false, // Ensures path cannot be null
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Defaults to the current timestamp
    },
    clientname: {
      type: DataTypes.STRING,
      allowNull: false, // If clientname is required
    },
    filetype: {
      type: DataTypes.STRING(50),
      allowNull: false, // If filetype is required
    },
    
  },
  {
    sequelize,
    modelName: 'Document',
    tableName: 'documents', // Match the database table name
    timestamps: true, // Automatically add createdAt and updatedAt fields
    createdAt: 'createdat', // Map Sequelize's createdAt to `createdat` column
    updatedAt: 'updatedat', // Map Sequelize's updatedAt to `updatedat` column
  }
);

module.exports = Document;
