import express from 'express';
import { Router } from 'express';
import { emailController } from '../controllers/EmailController.js';

const emailRoutes = Router();




const router = express.Router();

router.post('/', emailController.sendEmail);

export { router as emailRoutes }

// Export the router with a name
export default router;
