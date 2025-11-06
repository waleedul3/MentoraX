import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;