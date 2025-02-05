// backend/src/controllers/invitationController.ts

import { Request, Response } from 'express';
import { InvitationService } from '../services/InvitationService.js';
import { AppError } from '../utils/appError';
import { z } from 'zod';
import { InvitationStatus } from '@prisma/client';

const createInvitationSchema = z.object({
    eventId: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.nativeEnum(InvitationStatus),
    comment: z.string().optional(),
    responseDate: z.date().optional(),
    emailStatus: z.enum(['SENT', 'ERROR']).optional(),
    drinkSelections: z.any().optional(),
});


const updateInvitationSchema = z.object({
    status: z.nativeEnum(InvitationStatus).optional(),
    comment: z.string().optional(),
    responseDate: z.date().optional(),
    emailStatus: z.enum(['SENT', 'ERROR']).optional(),
    drinkSelections: z.any().optional(),
    // ... other fields
});

const sendInvitationsSchema = z.object({
    eventId: z.string().uuid(),
    userIds: z.array(z.string().uuid()),
    status: z.nativeEnum(InvitationStatus),
    comment: z.string().optional(),
    responseDate: z.date().optional(),
    emailStatus: z.enum(['SENT', 'ERROR']).optional(),
    drinkSelections: z.any().optional(),
});


export class InvitationController {
    sendInvitations(arg0: string, auth: any, sendInvitations: any) {
        throw new Error('Method not implemented.');
    }
    async getAllInvitations(req: Request, res: Response) {
        try {
            const invitations = await new InvitationService().findMany();
            res.json(invitations);
        } catch (error) {
            console.error("Get invitations error:", error);
            res.status(500).json({ message: 'Failed to fetch invitations' });
        }
    }

    async getInvitationById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const invitation = await new InvitationService().getInvitationById(id);
            if (invitation === null) {
                throw new AppError(404, 'Invitation not found');
            }
            res.json(invitation);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Get invitation error:", error);
                res.status(500).json({ message: 'Failed to fetch invitation' });
            }
        }
    }

    async createInvitation(req: Request, res: Response) {
        try {
            const data = createInvitationSchema.parse(req.body);
            const { eventId, userId, ...rest } = data;
            const newInvitation = await new InvitationService();
            const invitation = await newInvitation.createInvitation(eventId, userId, rest);


            res.status(201).json(newInvitation);

        } catch (error) {
            console.error("Create event error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors });
            }
            res.status(500).json({ message: 'Failed to create invitation' });
        }
    }

    async updateInvitationStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const updatedInvitation = await new InvitationService().updateInvitationStatus(id, status);
            res.json(updatedInvitation);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error updating invitation response:', error);
                res.status(500).json({ error: 'Failed to update invitation response' });
            }
        }
    }

    async getInvitationsByUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const invitations = await new InvitationService().getInvitationsByUser(userId);
            res.json(invitations);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error fetching invitations by user:', error);
                res.status(500).json({ message: 'Failed to fetch invitations by user' });
            }
        }
    }

    async getInvitationsByEvent(req: Request, res: Response) {
        const { eventId } = req.params;
        try {
            const invitations = await new InvitationService().getInvitationsByEvent(eventId);
            res.json(invitations);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error('Error fetching invitations by event:', error);
                res.status(500).json({ message: 'Failed to fetch invitations by event' });
            }
        }
    }
}

export const invitationController = new InvitationController();
