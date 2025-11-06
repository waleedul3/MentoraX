import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Earning from '../models/Earning.js';

const router = express.Router();

// Initialize Razorpay
let razorpay = null;
try {
  console.log('Checking Razorpay credentials...');
  console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing');
  console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing');
  
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  } else {
    console.log('❌ Razorpay credentials not found');
  }
} catch (error) {
  console.log('❌ Razorpay initialization failed:', error.message);
}

// Create payment order
router.post('/create-order', protect, async (req, res) => {
  try {
    console.log('Creating payment order for user:', req.user.id);
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    console.log('Course found:', course.title, 'Price:', course.price);

    // Validate price
    const price = Number(course.price);
    if (!price || Number.isNaN(price) || price <= 0) {
      console.error('Invalid course price for course', course._id, course.price);
      return res.status(400).json({ message: 'Course has invalid price configured' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const options = {
      amount: Math.round(price * 100), // Amount in paise
      currency: 'INR',
      receipt: `course_${courseId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: req.user.id,
        courseName: course.title
      }
    };

    console.log('Creating Razorpay order with options:', options);
    
    let order;
    if (razorpay) {
      try {
        console.log('Attempting to create Razorpay order...');
        order = await razorpay.orders.create(options);
        console.log('Razorpay order created successfully:', order.id);
      } catch (razorpayError) {
        console.error('Razorpay order creation failed:', razorpayError);
        // Fallback to mock order for development
        console.log('Creating mock order as fallback...');
        order = {
          id: `order_mock_${Date.now()}`,
          amount: options.amount,
          currency: options.currency
        };
      }
    } else {
      console.log('Razorpay not initialized, creating mock order...');
      order = {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency
      };
    }
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: `Failed to create payment order: ${error.message}` });
  }
});

// Verify payment and enroll
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    
    console.log('=== PAYMENT VERIFICATION START ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);
    console.log('Course ID:', courseId);

    // Verify payment signature (skip for mock orders)
    if (!razorpay_order_id.startsWith('order_mock_')) {
      console.log('Verifying real payment signature...');
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      console.log('Expected Signature:', expectedSignature);
      console.log('Received Signature:', razorpay_signature);

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      console.log('Payment signature verified successfully');
    } else {
      console.log('Mock payment - skipping signature verification');
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      console.log('User already enrolled');
      return res.json({ message: 'Already enrolled in course', courseId });
    }

    // Enroll student
    course.enrolledStudents.push(req.user.id);
    await course.save();
    console.log('Student added to course');

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { coursesEnrolled: courseId } // Use addToSet to avoid duplicates
    });
    console.log('Course added to user enrolled courses');

    // Create progress record
    const existingProgress = await Progress.findOne({ userId: req.user.id, courseId: courseId });
    if (!existingProgress) {
      await Progress.create({
        userId: req.user.id,
        courseId: courseId,
        percentage: 0,
        lessonsCompleted: []
      });
      console.log('Progress record created');
    }

    // Create earning record for mentor
    await Earning.create({
      mentor: course.instructor,
      course: courseId,
      student: req.user.id,
      amount: course.price,
      commission: 0.2,
      netAmount: course.price * 0.8,
      type: 'course_enrollment',
      status: 'pending'
    });
    console.log('Earning record created for mentor');

    console.log('=== PAYMENT VERIFICATION SUCCESS ===');
    res.json({ 
      message: 'Payment successful and enrolled in course',
      courseId: courseId,
      success: true
    });
  } catch (error) {
    console.error('=== PAYMENT VERIFICATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: `Payment verification failed: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;