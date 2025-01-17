const express = require('express');
const User = require('../models/User');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// GET - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Route for user registration
router.post('/register', registerUser);

// POST - Route for user login
router.post('/login', loginUser);

module.exports = router;

