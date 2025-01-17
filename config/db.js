require('dotenv').config();
const { Sequelize } = require('sequelize');

// Sequelize instance for connecting to PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,  // Enable SSL for Render-hosted DB
      rejectUnauthorized: false,  // Disable certificate validation if necessary
    },
  },
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
