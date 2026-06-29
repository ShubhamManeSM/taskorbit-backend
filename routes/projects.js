const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /projects — Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingProject = await Project.findOne({ name });
    if (existingProject) {
      return res.status(400).json({ message: 'Project with this name already exists' });
    }
    const project = new Project({ name, description });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// GET /projects — Fetch all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

module.exports = router;
