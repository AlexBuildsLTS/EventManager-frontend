import express, { Router, Request, Response } from 'express';
import { eventController, eventService } from '../controllers/eventController.js';
import { auth, ownerOrAdmin } from '../middleware/index.js';

const router: Router = express.Router();

router.post('/', auth, async (req:Request, res:Response) => eventController.createEvent(req, res));
router.get('/', auth, async (req:Request, res:Response) => eventController.getEvents(req, res));
router.get('/:id', auth, async (req:Request, res:Response) => eventController.getEvent(req, res));
router.get('/user/:userId', auth, async (req:Request, res:Response) => eventController.getEventsByUserId(req, res));

router.patch('/:id', auth, ownerOrAdmin, async (req:Request, res:Response) => await eventController.updateEvent(req, res,));

router.delete('/:id', auth, ownerOrAdmin, async (req: Request, res: Response) => await eventController.deleteEvent(req, res,));

    
export default router;




