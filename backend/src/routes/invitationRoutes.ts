import { invitationController } from '../controllers/invitations.js';
import { auth, ownerOrAdmin } from '../middleware/auth.js';
import express from 'express';

    const router = express.Router();

    router.post('/', auth, invitationController.createInvitation);
    router.patch('/:id/status', auth, invitationController.updateInvitationStatus);
    router.get('/user/:userId', auth, invitationController.getInvitationsByUser);
    router.get('/event/:eventId', auth, ownerOrAdmin, invitationController.getInvitationsByEvent);

    export { router as invitationRoutes };
