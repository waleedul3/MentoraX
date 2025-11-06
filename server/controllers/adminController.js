import User from '../models/User.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import Progress from '../models/Progress.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalCourses = await Course.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    
    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: thirtyDaysAgo }
    });

    // Course enrollments
    const enrollmentStats = await Course.aggregate([
      {
        $project: {
          title: 1,
          enrollmentCount: { $size: '$enrolledStudents' }
        }
      },
      { $sort: { enrollmentCount: -1 } },
      { $limit: 5 }
    ]);

    // Monthly user registrations
    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalMentors,
          totalCourses,
          totalCertificates,
          activeUsers
        },
        topCourses: enrollmentStats,
        monthlyRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['student', 'mentor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin' && user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete other admin users'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI recommendations (stub)
// @route   GET /api/admin/recommendations/:userId
// @access  Private (Admin)
export const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    
    // Get user's enrolled courses and preferences
    const user = await User.findById(userId)
      .populate('coursesEnrolled', 'category level');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mock AI recommendations based on user data
    const enrolledCategories = user.coursesEnrolled.map(course => course.category);
    const preferredCategories = user.preferences?.categories || [];
    
    // Find courses in similar categories
    const recommendedCourses = await Course.find({
      category: { $in: [...enrolledCategories, ...preferredCategories] },
      _id: { $nin: user.coursesEnrolled.map(c => c._id) },
      isPublished: true
    })
      .populate('instructor', 'name')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        message: 'AI-powered recommendations based on learning history',
        recommendations: recommendedCourses,
        reasoning: 'Based on enrolled courses and preferences'
      }
    });
  } catch (error) {
    next(error);
  }
};