import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get user's overall progress
// @route   GET /api/progress
// @access  Private
export const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress for specific course
// @route   GET /api/progress/course/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
      courseId: req.params.courseId
    }).populate('lessonsCompleted.lessonId', 'title order');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress not found for this course'
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson progress
// @route   POST /api/progress/lesson/:lessonId
// @access  Private
export const updateLessonProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { watchTime, courseId } = req.body;

    // Find or create progress record
    let progress = await Progress.findOne({
      userId: req.user.id,
      courseId
    });

    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        courseId
      });
    }

    // Check if lesson already completed
    const existingLesson = progress.lessonsCompleted.find(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (!existingLesson) {
      // Add completed lesson
      progress.lessonsCompleted.push({
        lessonId,
        watchTime: watchTime || 0
      });

      // Update last accessed lesson
      progress.lastAccessedLesson = lessonId;

      // Calculate new percentage
      const course = await Course.findById(courseId).populate('lessons');
      const totalLessons = course.lessons.length;
      progress.percentage = progress.calculatePercentage(totalLessons);

      // Check if course is completed
      if (progress.percentage === 100) {
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }

      await progress.save();

      // Award XP points
      const user = await User.findById(req.user.id);
      user.xpPoints += 10; // 10 XP per lesson completion
      
      // Update streak
      const today = new Date().toDateString();
      const lastActive = new Date(user.lastActive).toDateString();
      
      if (today !== lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActive === yesterday.toDateString()) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }
      }
      
      user.lastActive = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Lesson marked as completed',
        data: {
          progress,
          xpEarned: 10,
          newStreak: user.streak
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Lesson already completed',
        data: progress
      });
    }
  } catch (error) {
    next(error);
  }
};