import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

const router = express.Router();

// Test endpoint to debug request parsing
router.post('/test', protect, (req, res) => {
  console.log('Test endpoint - req.body:', req.body);
  console.log('Test endpoint - req.user:', req.user);
  res.json({ body: req.body, user: req.user });
});

// Simple send message endpoint for testing
router.post('/send-simple', protect, async (req, res) => {
  try {
    console.log('Simple send - Full request body:', JSON.stringify(req.body, null, 2));
    
    const newMessage = new Message({
      sender: req.user.id,
      recipient: req.body.mentorId,
      subject: req.body.subject,
      message: req.body.message,
      course: req.body.courseId || undefined
    });
    
    const savedMessage = await newMessage.save();
    console.log('Message saved:', savedMessage._id);
    
    res.status(201).json({ success: true, messageId: savedMessage._id });
  } catch (error) {
    console.error('Simple send error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get mentor messages
// @route   GET /api/messages/mentor
// @access  Private (Mentor only)
router.get('/mentor', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'name email avatar')
      .populate('course', 'title')
      .populate('replies.sender', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Send message to mentor
// @route   POST /api/messages/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    console.log('Send message request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('User from token:', req.user);
    
    const { mentorId, courseId, subject, message } = req.body;
    
    console.log('Extracted fields:', { mentorId, courseId, subject, message });
    
    if (!mentorId) {
      return res.status(400).json({ message: 'Mentor ID is required' });
    }
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const messageData = {
      sender: req.user.id,
      recipient: mentorId,
      subject: subject,
      message: message
    };
    
    if (courseId) {
      messageData.course = courseId;
    }
    
    console.log('Creating message with data:', messageData);
    
    const newMessage = new Message(messageData);
    await newMessage.save();
    
    await newMessage.populate('sender', 'name email avatar');
    if (courseId) {
      await newMessage.populate('course', 'title');
    }
    
    console.log('Message saved successfully:', newMessage._id);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private
router.post('/:id/reply', protect, async (req, res) => {
  try {
    const { message } = req.body;
    
    const messageDoc = await Message.findById(req.params.id);
    if (!messageDoc) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    messageDoc.replies.push({
      sender: req.user.id,
      message
    });
    
    await messageDoc.save();
    await messageDoc.populate('replies.sender', 'name email');
    
    res.json(messageDoc);
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;