import express from 'express';
import {
  getMentors,
  getMentor,
  sendMessage,
  getMessages,
  getChatRooms
} from '../controllers/mentorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getMentors);
router.get('/chats', getChatRooms);
router.get('/:id', getMentor);
router.post('/:id/message', sendMessage);
router.get('/:id/messages', getMessages);

export default router;