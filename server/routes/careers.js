import express from 'express';
import Career from '../models/Career.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all active careers
// @route   GET /api/careers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create career
// @route   POST /api/careers
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Career deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;