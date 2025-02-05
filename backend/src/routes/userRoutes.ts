import { Router } from 'express';
import { userController } from '../controllers/UserController.js';
import multer from 'multer';
import auth from '../middleware/authMiddleware.js';
import { Request, RequestHandler, Response } from 'express-serve-static-core';


const router = Router();
//This is a placeholder for the getCurrentUser function.  The function is defined below.
const getCurrentUser: RequestHandler = (req, res) => {
    //Implement getCurrentUser logic here
    res.json(req.user);
};

userController.getCurrentUser = getCurrentUser;

//... your routes...

// Route to import users from CSV (admin only)
const uploadCsv = multer({ dest: 'uploads/', limits: { fileSize: 1000000, files: 1 } });
const importUsersHandler: RequestHandler = (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const file = req.file;
    // @ts-ignore
    return userController.importUsers(file, res);
};
router.post('/import', auth, uploadCsv.single('file'), importUsersHandler);
router.post('/import', auth, uploadCsv.single('file'), importUsersHandler);     // Route to export users to CSV (admin only)
router.get('/export', auth, userController.exportUsersToCsv);

// Route to get all users (admin only)
router.get('/', auth, userController.getUsers);

// Route to get a user by ID (admin only)
router.get('/:id', auth, userController.getUserById);

// Route to create a new user (admin only)
router.post('/', auth, userController.createUser);

// Route to update a user (admin only)
router.put('/:id', auth, userController.updateUser);

// Route to delete a user (admin only)
router.delete('/:id', auth, userController.deleteUser);

// Route to change user password
router.patch('/:id/password', auth, userController.changeUserPassword);

// Route to send new user password
router.post('/:id/password/reset', auth, userController.sendNewUserPassword);

// Route to handle user login
router.post('/login', userController.login);


router.get('/me', auth, userController.getCurrentUser);

export default router;

