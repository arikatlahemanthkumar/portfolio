import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/featured', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching featured projects:', err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const projects = await Project.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects by category:', err.message);
    res.status(500).send('Server Error');
  }
});

export default router; 