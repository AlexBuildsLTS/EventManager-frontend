import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';

const router = Router();

// Route for user login
router.post('/login', authController.login);

// Route for user registration
router.post('/register', authController.register);

export default router;