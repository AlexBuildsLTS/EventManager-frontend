import express from 'express';
import { userController } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.get('/:id', auth, userController.getUsers);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

export { router as userRoutes };


