import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import auth from '../middleware/authMiddleware';

const router = Router();
const eventController = new EventController();

// Route to get all events
router.get('/', auth, eventController.getAllEvents);

// Route to get an event by ID
router.get('/:id', auth, eventController.getEvent);

// Route to create a new event
router.post('/', auth, eventController.createEvent);

// Route to update an event
router.put('/:id', auth, eventController.updateEvent);

// Route to delete an event
router.delete('/:id', auth, eventController.deleteEvent);

export default router;
