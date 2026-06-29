const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const teamRoutes = require('./routes/teams');
const projectRoutes = require('./routes/projects');
const tagRoutes = require('./routes/tags');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/teams', teamRoutes);
app.use('/projects', projectRoutes);
app.use('/tags', tagRoutes);
app.use('/report', reportRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'TaskOrbit API is running' });
});

const connectDB = require('./db/db.connect');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TaskOrbit API running on port ${PORT}`);
});

