import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get mentor sessions
// @route   GET /api/sessions/mentor
// @access  Private (Mentor only)
router.get('/mentor', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user.id })
      .populate('attendees.user', 'name email')
      .sort({ date: 1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Mentor only)
router.post('/', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { title, description, date, duration, maxAttendees, price } = req.body;
    
    const session = new Session({
      mentor: req.user.id,
      title,
      description,
      date,
      duration,
      maxAttendees,
      price,
      meetingLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`
    });
    
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Mentor only)
router.put('/:id', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedSession);
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Mentor only)
router.delete('/:id', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Join session
// @route   POST /api/sessions/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.attendees.length >= session.maxAttendees) {
      return res.status(400).json({ message: 'Session is full' });
    }
    
    const alreadyJoined = session.attendees.some(
      attendee => attendee.user.toString() === req.user.id
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this session' });
    }
    
    session.attendees.push({ user: req.user.id });
    await session.save();
    
    res.json({ message: 'Successfully joined session', meetingLink: session.meetingLink });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;