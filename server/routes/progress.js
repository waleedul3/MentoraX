import express from 'express';
import {
  getProgress,
  updateLessonProgress,
  getCourseProgress
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getProgress);
router.get('/course/:courseId', getCourseProgress);
router.post('/lesson/:lessonId', updateLessonProgress);

export default router;