require('dotenv').config();
const { Sequelize } = require('sequelize');

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
});


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
