import { Event, Prisma } from '@prisma/client';
import { prisma } from '../database/db.js';
import { AppError } from '../utils/appError';

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

export const eventService = new EventService();
