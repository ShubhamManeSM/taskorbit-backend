const express = require('express');
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /tags — Create a new tag
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error creating tag', error: error.message });
  }
});

// GET /tags — Fetch all tags
router.get('/', auth, async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error: error.message });
  }
});

module.exports = router;
