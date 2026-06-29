const express = require('express');
const Team = require('../models/Team');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /teams — Create a new team
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team with this name already exists' });
    }
    const team = new Team({ name, description });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error: error.message });
  }
});

// GET /teams — Fetch all teams
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
});

module.exports = router;
