import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getEnrolledCourses,
  getMyCourses,
  rateCourse,
  getMentorRatings
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(protect, authorize('mentor', 'admin'), createCourse);

router.get('/enrolled', protect, getEnrolledCourses);
router.get('/my-courses', protect, (req, res, next) => {
  console.log('User role:', req.user.role);
  console.log('User ID:', req.user.id);
  next();
}, authorize('mentor', 'admin'), getMyCourses);
router.get('/instructor', protect, authorize('mentor', 'admin'), getMyCourses);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('mentor', 'admin'), updateCourse)
  .delete(protect, authorize('mentor', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/rate', protect, rateCourse);
router.get('/mentor/:id/ratings', protect, getMentorRatings);

export default router;