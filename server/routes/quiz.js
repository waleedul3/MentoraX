import express from 'express';
import {
  getQuiz,
  submitQuiz,
  createQuiz,
  updateQuiz,
  getQuizAttempts
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/course/:courseId')
  .get(getQuiz)
  .post(authorize('mentor', 'admin'), createQuiz);

router.route('/:quizId')
  .put(authorize('mentor', 'admin'), updateQuiz);

router.post('/:quizId/submit', submitQuiz);
router.get('/:quizId/attempts', getQuizAttempts);

export default router;