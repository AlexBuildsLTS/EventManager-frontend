import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { body, validationResult } from 'express-validator';




const router = Router();

router.post('/login', login);
router.post('/register', register);

export { router as authRoutes };
