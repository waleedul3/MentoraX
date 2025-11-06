import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Earning from '../models/Earning.js';
import Session from '../models/Session.js';
import PaymentDetail from '../models/PaymentDetail.js';
import PayoutRequest from '../models/PayoutRequest.js';

console.log('Mentor routes loaded with payout-request endpoint');

const router = express.Router();

// @desc    Get mentor overview/dashboard stats
// @route   GET /api/mentor/overview
// @access  Private (Mentor only)
router.get('/overview', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const mentorId = req.user.id;
    
    // Get mentor's courses
    const courses = await Course.find({ instructor: mentorId });
    const totalCourses = courses.length;
    
    // Calculate total students (unique enrollments across all courses)
    const allEnrollments = courses.reduce((acc, course) => {
      return acc.concat(course.enrolledStudents || []);
    }, []);
    const totalStudents = [...new Set(allEnrollments)].length;
    
    // Calculate average rating
    const ratingsData = courses.reduce((acc, course) => {
      if (course.ratings && course.ratings.length > 0) {
        const courseAvg = course.ratings.reduce((sum, rating) => sum + rating.rating, 0) / course.ratings.length;
        acc.totalRating += courseAvg;
        acc.courseCount += 1;
      }
      return acc;
    }, { totalRating: 0, courseCount: 0 });
    
    const avgRating = ratingsData.courseCount > 0 ? (ratingsData.totalRating / ratingsData.courseCount).toFixed(1) : '0.0';
    
    // Get monthly earnings
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const earnings = await Earning.find({
      mentor: mentorId,
      createdAt: { $gte: currentMonth }
    });
    
    const monthlyEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    
    res.json({
      totalCourses,
      totalStudents,
      avgRating,
      monthlyEarnings: monthlyEarnings.toFixed(2)
    });
  } catch (error) {
    console.error('Mentor overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get mentor sessions
// @route   GET /api/mentor/sessions
// @access  Private (Mentor only)
router.get('/sessions', protect, authorize('mentor', 'admin'), async (req, res) => {
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

// @desc    Get mentor earnings
// @route   GET /api/mentor/earnings
// @access  Private (Mentor only)
router.get('/earnings', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const mentorId = req.user.id;
    
    // Get all earnings for this mentor
    const earnings = await Earning.find({ mentor: mentorId })
      .populate('course', 'title price')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    
    // Calculate totals
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.netAmount, 0);
    const pendingEarnings = earnings
      .filter(earning => earning.status === 'pending')
      .reduce((sum, earning) => sum + earning.netAmount, 0);
    const completedEarnings = earnings
      .filter(earning => earning.status === 'completed')
      .reduce((sum, earning) => sum + earning.netAmount, 0);
    
    // Get monthly earnings for current year
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = Array.from({ length: 12 }, (_, month) => {
      const monthEarnings = earnings.filter(earning => {
        const earningDate = new Date(earning.createdAt);
        return earningDate.getFullYear() === currentYear && earningDate.getMonth() === month;
      });
      return {
        month: month + 1,
        amount: monthEarnings.reduce((sum, earning) => sum + earning.netAmount, 0),
        count: monthEarnings.length
      };
    });
    
    res.json({
      earnings,
      summary: {
        totalEarnings,
        pendingEarnings,
        completedEarnings,
        totalTransactions: earnings.length
      },
      monthlyEarnings
    });
  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get/Update payment details
// @route   GET/POST /api/mentor/payment-details
// @access  Private (Mentor only)
router.get('/payment-details', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const paymentDetails = await PaymentDetail.findOne({ mentor: req.user.id });
    res.json(paymentDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/payment-details', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { bankName, accountNumber, ifscCode, accountHolderName, upiId, panNumber } = req.body;
    
    const paymentDetails = await PaymentDetail.findOneAndUpdate(
      { mentor: req.user.id },
      { bankName, accountNumber, ifscCode, accountHolderName, upiId, panNumber },
      { new: true, upsert: true }
    );
    
    res.json(paymentDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Request payout
// @route   POST /api/mentor/payout-request
// @access  Private (Mentor only)
router.post('/payout-request', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const { amount } = req.body;
    const mentorId = req.user.id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payout amount' });
    }
    
    // Check if payment details exist
    const paymentDetails = await PaymentDetail.findOne({ mentor: mentorId });
    if (!paymentDetails) {
      return res.status(400).json({ message: 'Please add payment details first' });
    }
    
    // Get pending earnings
    const pendingEarnings = await Earning.find({ 
      mentor: mentorId, 
      status: 'pending' 
    });
    
    const totalPending = pendingEarnings.reduce((sum, earning) => sum + (earning.netAmount || 0), 0);
    
    if (amount > totalPending) {
      return res.status(400).json({ message: 'Insufficient pending balance' });
    }
    
    // Create payout request
    const payoutRequest = await PayoutRequest.create({
      mentor: mentorId,
      amount,
      paymentDetails: paymentDetails._id,
      earnings: pendingEarnings.slice(0, Math.ceil(pendingEarnings.length * (amount / totalPending))).map(e => e._id)
    });
    
    res.json({ 
      message: 'Payout request submitted successfully',
      requestId: payoutRequest._id,
      amount
    });
  } catch (error) {
    console.error('Payout request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get payout requests
// @route   GET /api/mentor/payout-requests
// @access  Private (Mentor only)
router.get('/payout-requests', protect, authorize('mentor', 'admin'), async (req, res) => {
  try {
    const requests = await PayoutRequest.find({ mentor: req.user.id })
      .populate('paymentDetails')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;