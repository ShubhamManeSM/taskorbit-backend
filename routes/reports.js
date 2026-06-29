const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /report/last-week — Tasks completed in the last 7 days
router.get('/last-week', auth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const tasks = await Task.find({
      status: 'Completed',
      updatedAt: { $gte: oneWeekAgo }
    })
      .populate('project', 'name')
      .populate('team', 'name')
      .populate('owners', 'name email');

    // Group tasks by day of the week
    const dailyCounts = {};
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    tasks.forEach(task => {
      const day = days[new Date(task.updatedAt).getDay()];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    res.json({
      totalCompleted: tasks.length,
      dailyCounts,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// GET /report/pending — Total days of work pending
router.get('/pending', auth, async (req, res) => {
  try {
    const pendingTasks = await Task.find({ status: { $ne: 'Completed' } })
      .populate('project', 'name')
      .populate('team', 'name');

    const totalPendingDays = pendingTasks.reduce((sum, task) => sum + task.timeToComplete, 0);

    // Group by project
    const byProject = {};
    pendingTasks.forEach(task => {
      const projectName = task.project?.name || 'Unassigned';
      if (!byProject[projectName]) {
        byProject[projectName] = { days: 0, count: 0 };
      }
      byProject[projectName].days += task.timeToComplete;
      byProject[projectName].count += 1;
    });

    res.json({
      totalPendingDays,
      totalPendingTasks: pendingTasks.length,
      byProject
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

// GET /report/closed-tasks — Tasks closed grouped by team, owner, project
router.get('/closed-tasks', auth, async (req, res) => {
  try {
    const closedTasks = await Task.find({ status: 'Completed' })
      .populate('project', 'name')
      .populate('team', 'name')
      .populate('owners', 'name email');

    // Group by team
    const byTeam = {};
    closedTasks.forEach(task => {
      const teamName = task.team?.name || 'Unassigned';
      byTeam[teamName] = (byTeam[teamName] || 0) + 1;
    });

    // Group by owner
    const byOwner = {};
    closedTasks.forEach(task => {
      task.owners.forEach(owner => {
        const ownerName = owner.name || 'Unknown';
        byOwner[ownerName] = (byOwner[ownerName] || 0) + 1;
      });
    });

    // Group by project
    const byProject = {};
    closedTasks.forEach(task => {
      const projectName = task.project?.name || 'Unassigned';
      byProject[projectName] = (byProject[projectName] || 0) + 1;
    });

    res.json({
      totalClosed: closedTasks.length,
      byTeam,
      byOwner,
      byProject
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});

module.exports = router;
