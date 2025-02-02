import { Request, Response, RequestHandler } from 'express';
import { Event, PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.js';
import { z, ZodError } from 'zod';
import { JwtPayload, User, UserSelect } from '../models/index.js';



const prisma = new PrismaClient();

export default prisma;

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.date(),
  location: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  participantIds: z.array(z.string()).optional(),
});

const updateEventSchema = createEventSchema.partial();


export class EventController {
  getEvents(arg0: string, auth: ({ req, res, next }: AuthParams) => void, getEvents: any) {
      throw new Error('Method not implemented.');
  }
  getEvent(arg0: string, auth: ({ req, res, next }: AuthParams) => void, getEvent: any) {
      throw new Error('Method not implemented.');
  }
  getEventsByUserId(arg0: string, auth: ({ req, res, next }: AuthParams) => void, getEventsByUserId: any) {
      throw new Error('Method not implemented.');
  }
  deleteEvent: any;
  createEvent(arg0: string, auth: ({ req, res, next }: AuthParams) => void, createEvent: any) {
      throw new Error('Method not implemented.');
  }
  async updateEvent(): Promise<RequestHandler> {
      try {
        return async (req: Request, res: Response) => {
          const data = updateEventSchema.parse(req.body);

          const event = await eventService.getEventById(req.params.id);
          if (!event) {
            throw new AppError(404, 'Event not found');
          }
          const user = req.user as unknown as User;
          if (user.role !== 'ADMIN' && event.createdBy !== user.id) {
            throw new AppError(403, 'Access denied');
          }

          const updatedEvent = await eventService.updateEvent(req.params.id, data);
          res.json(updatedEvent);
        }
      } catch (error) {
        return async (req: Request, res: Response) => {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
          } else if (error instanceof ZodError) {
             res.status(400).json({ message: error.message });
          } else {
            console.error('Error updating event:', error);
            res.status(500).json({ message: 'Server error' });
          }
        }
      }
    }
}
export const eventController = new EventController();
export class EventService {
  async updateEvent(id: string, data: Partial<Event>) {
    try {
        const validatedData = updateEventSchema.parse(data);
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: validatedData,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return updatedEvent;

    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(400, error.message);
      }
      throw new AppError(500, 'Failed to update event');
    }
  }
  async getEventById(id: string): Promise<Event | null> {
    return prisma.event.findUnique({ where: { id } });
  }
}
export const eventService = new EventService();