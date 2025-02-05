import { Router } from 'express';
import { invitationController } from '../controllers/InvitationsController';
import auth from '../middleware/authMiddleware';

    
const router = Router();

// Route to get all invitations

 


router.get('/', auth, invitationController.getAllInvitations);
router.get('/:id', auth, invitationController.getInvitationById);
router.post('/', auth, invitationController.createInvitation);

// Route to update an invitation's status
router.patch('/:id/status', auth, invitationController.updateInvitationStatus);

// Route to get invitations by user ID
router.get('/user/:userId', auth, invitationController.getInvitationsByUser);

// Route to get invitations by event ID
router.get('/event/:eventId', auth, invitationController.getInvitationsByEvent);

router.delete('/:id', auth, invitationController.createInvitation);
router.post('/send', auth, invitationController.sendInvitations);

export { router as invitationRoutes };
