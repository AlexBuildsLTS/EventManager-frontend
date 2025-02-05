import { Event, Prisma } from '@prisma/client';
import { prisma } from '../database/db.js';
import { AppError } from '../utils/appError';
import { Request, Response } from 'express';

export class EventController {
    async getAllEvents(req: Request, res: Response) {
        const events = await new EventService().getAllEvents();
        res.json(events);
    }
    async getEvent(req: Request, res: Response) {
        const event = await new EventService().getEvent(req.params.id);
        res.json(event);
    }
    async createEvent(req: Request, res: Response) {
        const event = await new EventService().createEvent(req.body);
        res.json(event);
    }
    async updateEvent(req: Request, res: Response) {
        const event = await new EventService().updateEvent(req.params.id, req.body);
        res.json(event);
    }
    async deleteEvent(req: Request, res: Response) {
        await new EventService().deleteEvent(req.params.id);
        res.status(204).send();
    }
}

export class EventService {
    async getAllEvents(): Promise<Event[]> {
        try {
            const events = await prisma.event.findMany();
            return events as Event[];
        } catch (error) {
            console.error('Error fetching events:', error);
            throw new AppError(500, 'Failed to fetch events');
        }
    }

    async getEvent(id: string): Promise<Event | null> {
        try {
            const event = await prisma.event.findUnique({ where: { id } });
            return event;
        } catch (error) {
            console.error('Error fetching event:', error);
            throw new AppError(500, 'Failed to fetch event');
        }
    }

    async createEvent(data: Prisma.EventCreateInput): Promise<Event> {
        try {
            const event = await prisma.event.create({ data });
            return event;
        } catch (error) {
            console.error('Error creating event:', error);
            throw new AppError(500, 'Failed to create event');
        }
    }

    async updateEvent(id: string, data: Prisma.EventUpdateInput): Promise<Event | null> {
        try {
            const updatedEvent = await prisma.event.update({
                where: { id },
                data,
            });
            return updatedEvent;
        } catch (error) {
            console.error('Error updating event:', error);
            throw new AppError(500, 'Failed to update event');
        }
    }

    async deleteEvent(id: string): Promise<void> {
        try {
            await prisma.event.delete({ where: { id } });
        } catch (error) {
            console.error('Error deleting event:', error);
            throw new AppError(500, 'Failed to delete event');
        }
    }
}
export const eventController = new EventController();
