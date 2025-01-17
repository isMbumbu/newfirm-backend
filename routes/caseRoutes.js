const express = require('express');
const CaseDetails = require('../models/CaseDetails');

const router = express.Router();

// POST - Create a new case
router.post('/', async (req, res) => {
  try {
    const caseDetails = await CaseDetails.create(req.body);
    res.status(201).json(caseDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await CaseDetails.findAll();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
