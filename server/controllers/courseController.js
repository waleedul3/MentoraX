// @desc    Rate a course
// @route   POST /api/courses/:id/rate
// @access  Private (enrolled students)
export const rateCourse = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // Only enrolled students can rate
    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must be enrolled to rate this course.' });
    }
    // Prevent duplicate rating
    if (course.ratings.some(r => r.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'You have already rated this course.' });
    }
    // Add rating
    course.ratings.push({ user: req.user.id, rating, comment });
    // Update average and count
    const ratingsArr = course.ratings.map(r => r.rating);
    course.rating.average = ratingsArr.reduce((a, b) => a + b, 0) / ratingsArr.length;
    course.rating.count = ratingsArr.length;
    await course.save();
    res.json({ message: 'Rating submitted', rating: course.rating });
  } catch (error) {
    console.error('Error rating course:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all ratings for mentor's courses
// @route   GET /api/mentor/:id/ratings
// @access  Private (mentor)
export const getMentorRatings = async (req, res) => {
  try {
    const mentorId = req.params.id;
    const courses = await Course.find({ instructor: mentorId }).select('title ratings');
    const ratings = courses.map(course => ({
      courseTitle: course.title,
      ratings: course.ratings
    }));
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching mentor ratings:', error);
    res.status(500).json({ message: error.message });
  }
};
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar')
      .populate('lessons', 'title duration')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar email')
      .populate('lessons', 'title description duration order content videoUrl')
      .populate('quiz', 'title description totalMarks timeLimit');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    if (req.user) {
      isEnrolled = course.enrolledStudents.includes(req.user.id);
    }

    // If not enrolled, hide full lesson content
    if (!isEnrolled && course.lessons) {
      course.lessons = course.lessons.map(lesson => ({
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order,
        // Hide content and videoUrl for non-enrolled users
        content: lesson.isPreview ? lesson.content : 'Enroll to access full content',
        videoUrl: lesson.isPreview ? lesson.videoUrl : ''
      }));
    }

    res.json({ ...course.toObject(), isEnrolled });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Mentor/Admin)
export const createCourse = async (req, res, next) => {
  try {
    const { lessons, ...courseData } = req.body;
    courseData.instructor = req.user.id;
    
    // Create the course first
    courseData.isPublished = true; // Make course visible on public listing
    const course = await Course.create(courseData);
    
    // Create lessons if provided
    if (lessons && lessons.length > 0) {
      const createdLessons = await Promise.all(
        lessons.map(async (lessonData, index) => {
          const lesson = await Lesson.create({
            ...lessonData,
            course: course._id,
            order: index + 1
          });
          return lesson._id;
        })
      );
      
      // Update course with lesson references
      course.lessons = createdLessons;
      await course.save();
    }
    
    // Populate and return the complete course
    const populatedCourse = await Course.findById(course._id)
      .populate('lessons')
      .populate('instructor', 'name email');

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Mentor/Admin)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Not authorized to update this course'
      });
    }

    const { lessons, ...courseData } = req.body;
    
    // Update course basic info
    Object.assign(course, courseData);
    
    // Handle lessons update if provided
    if (lessons && lessons.length > 0) {
      // Delete existing lessons
      await Lesson.deleteMany({ course: course._id });
      
      // Create new lessons
      const createdLessons = await Promise.all(
        lessons.map(async (lessonData, index) => {
          const lesson = await Lesson.create({
            ...lessonData,
            course: course._id,
            order: index + 1
          });
          return lesson._id;
        })
      );
      
      course.lessons = createdLessons;
    }
    
    await course.save();
    
    // Return populated course
    const updatedCourse = await Course.findById(course._id)
      .populate('lessons')
      .populate('instructor', 'name email');

    res.json(updatedCourse);
  } catch (error) {
    console.error('Course update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Mentor/Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Make sure user is course owner or admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { coursesEnrolled: course._id }
    });

    // Create progress record
    await Progress.create({
      user: req.user.id,
      course: course._id,
      completionPercentage: 0
    });

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
export const getEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'coursesEnrolled',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      user.coursesEnrolled.map(async (course) => {
        const progress = await Progress.findOne({
          userId: req.user.id,
          courseId: course._id
        });
        
        return {
          ...course.toObject(),
          progress: progress ? progress.percentage : 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: coursesWithProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mentor's courses
// @route   GET /api/courses/my-courses
// @access  Private (Mentor/Admin)
export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('lessons', 'title duration')
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching mentor courses:', error);
    res.status(500).json({ message: error.message });
  }
};