require('dotenv').config();
const { Sequelize } = require('sequelize');

// Sequelize instance for connecting to PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,    // Database name (e.g., lawconnect)
  process.env.DB_USER,    // Database user (e.g., lawconnect_user)
  process.env.DB_PASSWORD, // Database password (e.g., password123)
  {
    host: process.env.DB_HOST,  // Database host (e.g., localhost)
    dialect: 'postgres',        // Using PostgreSQL as the dialect
    logging: false,             // Disable logging of SQL queries
  }
);

// Function to connect to the database
async function connectDB() {
  try {
    await sequelize.authenticate();  // Test the connection
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Export both sequelize and connectDB
module.exports = { sequelize, connectDB };
