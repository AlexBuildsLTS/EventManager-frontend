import { Request, Response } from 'express';
import { invitationService } from '../services/invitation';
import { eventService } from '../services/event';
import { z } from 'zod';
import { InvitationStatus } from '@prisma/client';
import { AppError } from '../middleware/error.js';

const createInvitationSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid()
});

const updateInvitationSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED'])
});

export class InvitationController {


  async getInvitationById(req: Request, res: Response) {
    const invitation = await invitationService.getInvitationById(req.params.id);
    if (!invitation) {
      throw new AppError(404, 'Invitation not found');
    }
    res.json(invitation);
  }

  async createInvitation(req: Request, res: Response) {
    const data = createInvitationSchema.parse(req.body);
    
    // Check if event exists and user has permission to invite
    const event = await eventService.getEventById(data.eventId);
    if (!event) {
      throw new AppError(404, 'Event not found');
    }
    
    if (req.user!.role !== 'ADMIN' && event.createdBy !== req.user!.userId) {
      throw new AppError(403, 'Access denied');
    }
    
    const invitation = await invitationService.createInvitation(data);
    res.status(201).json(invitation);
  }

  async updateInvitationStatus(req: Request, res: Response) {
    const { status } = updateInvitationSchema.parse(req.body);
    
    // Check if invitation exists and user has permission to respond
    const invitation = await invitationService.getInvitationById(req.params.id);
    if (!invitation) {
      throw new AppError(404, 'Invitation not found');
    }
    
    if (req.user!.role !== 'ADMIN' && invitation.userId !== req.user!.userId) {
      throw new AppError(403, 'Access denied');
    }
    
    const updatedInvitation = await invitationService.updateInvitationStatus(
      req.params.id,
      status
    );
    
    res.json(updatedInvitation);
  }

  async getInvitationsByUser(req: Request, res: Response) {
    // Users can only view their own invitations unless they're admin
    if (req.user!.role !== 'ADMIN' && req.params.userId !== req.user!.userId) {
      throw new AppError(403, 'Access denied');
    }
    
    const invitations = await invitationService.getInvitationsByUser(req.params.userId);
    res.json(invitations);
  }

  async getInvitationsByEvent(req: Request, res: Response) {
    // Check if user has access to event invitations
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) {
      throw new AppError(404, 'Event not found');
    }
    
    if (req.user!.role !== 'ADMIN' && event.createdBy !== req.user!.userId) {
      throw new AppError(403, 'Access denied');
    }
    
    const invitations = await invitationService.getInvitationsByEvent(req.params.eventId);
    res.json(invitations);
  }
}

export const invitationController = new InvitationController();