import { Request, Response, RequestHandler } from 'express';
import { Event } from '@prisma/client'; // Import Event type from Prisma
import { PrismaClient } from '@prisma/client';
import AppError from '../middleware/AppError.js'; // Import AppError for consistent error handling
import { z, ZodError } from 'zod'; // Import Zod for validation

const prisma = new PrismaClient();

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.date(),
  location: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  participantIds: z.array(z.string()).optional(), // Make participantIds optional
});

const updateEventSchema = createEventSchema.partial();


export class EventService {
  getEventById(id: string) {
    throw new Error('Method not implemented.');
  }
  // ... (Existing methods remain unchanged)

  async updateEvent(id: string, data: Partial<Event>) {
    try {
      const validatedData = updateEventSchema.parse(data); // Validate update data

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: validatedData, // Use validated data
        include: {  // Include only necessary data, if any.  Remove if not needed.
          creator: {
            select: {
              id: true,
              name: true,
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
        throw new AppError(400, error.message); // Throw AppError for validation errors
      }
      throw new AppError(500, 'Failed to update event'); // Throw AppError for other errors
    }
  }
}

export const eventService = new EventService();


export class EventController {
  // ... other controller methods
    
  async updateEvent(): Promise<RequestHandler> {
      try {
        return async (req: Request, res: Response) => {
          // Validate request body against the schema.
          const data = updateEventSchema.parse(req.body);

          const event = (await eventService.getEventById(req.params.id)) as Event & {createdBy: string};
          if (!event) {
            throw new AppError(404, 'Event not found'); // Use AppError
          }
          // Add type assertion for req.user.  This assumes you have middleware adding user to req.
          const user = req.user as { userId: string; role: string; };
          if (user.role !== 'ADMIN' && event.createdBy !== user.userId) {
            throw new AppError(403, 'Access denied'); // Use AppError
          }

          const updatedEvent = await eventService.updateEvent(req.params.id, data);
          res.json(updatedEvent);
        }
      } catch (error) {
        return async (req: Request, res: Response) => {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message }); // Handle AppErrors
          } else if (error instanceof ZodError) {
             res.status(400).json({ message: error.message });  // Zod validation errors
          } else {
            console.error('Error updating event:', error);
            res.status(500).json({ message: 'Server error' });
          }
        }
      }
    }


 // ... other controller methods
}
export const eventController = new EventController(); 

