import express from 'express';
import {
  getCertificates,
  getCertificate,
  downloadCertificate,
  verifyCertificate
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);

router.use(protect); // All other routes require authentication

router.get('/', getCertificates);
router.get('/:id', getCertificate);
router.get('/:id/download', downloadCertificate);

export default router;