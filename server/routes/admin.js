import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getRecommendations
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin')); // All routes require admin role

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// AI recommendations stub
router.get('/recommendations/:userId', getRecommendations);

// Payout requests management
router.get('/payout-requests', async (req, res) => {
  try {
    const PayoutRequest = (await import('../models/PayoutRequest.js')).default;
    const requests = await PayoutRequest.find({})
      .populate('mentor', 'name email')
      .populate('paymentDetails')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/payout-requests/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const PayoutRequest = (await import('../models/PayoutRequest.js')).default;
    const Earning = (await import('../models/Earning.js')).default;
    
    if (!['pending', 'paid', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const request = await PayoutRequest.findById(req.params.id).populate('earnings');
    if (!request) {
      return res.status(404).json({ message: 'Payout request not found' });
    }
    
    // Update request status
    request.status = status;
    request.notes = notes;
    request.processedAt = new Date();
    await request.save();
    
    // If approved, mark earnings as completed
    if (status === 'paid') {
      await Earning.updateMany(
        { _id: { $in: request.earnings } },
        { status: 'completed' }
      );
    }
    
    const updatedRequest = await PayoutRequest.findById(req.params.id)
      .populate('mentor', 'name email')
      .populate('paymentDetails');
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact management
router.get('/contacts', async (req, res) => {
  try {
    const Contact = (await import('../models/Contact.js')).default;
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const Contact = (await import('../models/Contact.js')).default;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Career management
router.get('/careers', async (req, res) => {
  try {
    const Career = (await import('../models/Career.js')).default;
    const careers = await Career.find({}).sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;