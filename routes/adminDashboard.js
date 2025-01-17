// routes/adminDashboard.js
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to check JWT
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from headers
  if (!token) return res.status(401).json({ error: 'Token is required' });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.admin = decoded; // Store admin info in request
    next();
  });
};

// Admin dashboard route
router.get('/dashboard', authenticateAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.admin.email}!` });
});

module.exports = router;
