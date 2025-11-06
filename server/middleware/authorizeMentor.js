export const authorizeMentor = (req, res, next) => {
  if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Mentor access required' });
  }
  next();
};

export const authorizeOwnCourse = async (req, res, next) => {
  try {
    const { Course } = await import('../models/Course.js');
    const course = await Course.findById(req.params.courseId || req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied to this course' });
    }
    
    req.course = course;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};