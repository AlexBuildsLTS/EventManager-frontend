import express from 'express';
import { userLevelController } from '../controllers/userLevels.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, adminOnly, userLevelController.createUserLevel);
router.get('/:id', auth, userLevelController.getUserLevel);
router.put('/:id', auth, adminOnly, userLevelController.updateUserLevel);
router.delete('/:id', auth, adminOnly, userLevelController.deleteUserLevel);


export { router as userLevelRoutes };