require('dotenv').config();
const { Sequelize } = require('sequelize');

// Sequelize instance for connecting to PostgreSQL
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
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
