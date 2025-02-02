import express from 'express';
import { emailController } from '../controllers/email.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, emailController.sendEmail);


export { router as emailRoutes };