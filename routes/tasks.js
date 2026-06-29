const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const Team = require('../models/Team');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /tasks — Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { name, project, team, owners, tags, timeToComplete, status } = req.body;
    const task = new Task({ name, project, team, owners, tags, timeToComplete, status });
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('team', 'name')
      .populate('owners', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// GET /tasks — Fetch tasks with optional filtering
router.get('/', auth, async (req, res) => {
  try {
    const { team, owner, tags, project, status, sort } = req.query;
    let filter = {};

    // Filter by team name (lookup team ID)
    if (team) {
      const teamDoc = await Team.findOne({ name: { $regex: new RegExp(team, 'i') } });
      if (teamDoc) filter.team = teamDoc._id;
      else return res.json([]);
    }

    // Filter by owner name (lookup user ID)
    if (owner) {
      const ownerDoc = await User.findOne({ name: { $regex: new RegExp(owner, 'i') } });
      if (ownerDoc) filter.owners = ownerDoc._id;
      else return res.json([]);
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagList };
    }

    // Filter by project name (lookup project ID)
    if (project) {
      const projectDoc = await Project.findOne({ name: { $regex: new RegExp(project, 'i') } });
      if (projectDoc) filter.project = projectDoc._id;
      else return res.json([]);
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Build sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'dueDate') sortOptions = { timeToComplete: 1 };
    if (sort === 'status') sortOptions = { status: 1 };

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('team', 'name')
      .populate('owners', 'name email')
      .sort(sortOptions);

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// GET /tasks/:id — Fetch a single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name description')
      .populate('team', 'name description')
      .populate('owners', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// POST /tasks/:id — Update a task
router.post('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('project', 'name')
      .populate('team', 'name')
      .populate('owners', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// DELETE /tasks/:id — Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

module.exports = router;
