import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.js';
import { z, ZodError } from 'zod';
import { Event } from '../models/index'; // Import Event type

const prisma = new PrismaClient();

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  date: z.date(),
  location: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  participantIds: z.array(z.string()).optional(),
});

const updateEventSchema = createEventSchema.partial();


export class EventService {
  async createEvent(data: Event) {
    console.log("data", data)
      try {
        const event = await prisma.event.create({
          data: {
            ...data,
            participantIds: data.participantIds ? { set: data.participantIds } : undefined,
                      createdBy: data.createdBy,
                    },
                    include: {
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
                      invitations: {
                        select: {
                          userId: true,
                        },
                      },
                    },
                  });
                  return event;
                } catch (error) {
                  if (error instanceof ZodError) {
                    throw new AppError(400, error.message);
                  }
                  throw new AppError(500, 'Failed to create event');
                }
              }
            
             articipantIds: data.participantIds ? { set: data.participantIds } : undefined,
          },
          include: {
            // Include creator details
            creator: {
              select: {
                id: true,
                name: true,
                email: true
              },
            },
            // Include participant details
            participants: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            // Include invitation details
            invitations: {
              select: {
                userId: true,
              },
            },
          },
        });
        return event;
      } catch (e) {
        console.log('error', e);
        throw e;
      }
  }

  async getEventById(id: string) {
    try {
      const event = await prisma.event.findUnique({ where: { id } });
      return event;
      } catch (error) {
      throw new AppError(500, 'Failed to get event');
    }
  }

  async updateEvent(id: string, data: Partial<Event>) {
    try {
      const validatedData = updateEventSchema.partial().parse(data);

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: validatedData,
        include: {
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
          invitations: {
            select: {
              userId: true,
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
}

export const eventService = new EventService();


export class EventController {
  async updateEvent(): Promise<RequestHandler> {
      try {
        return async (req: Request, res: Response) => {
          const data = updateEventSchema.parse(req.body);

          const event = await eventService.getEventById(req.params.id);
          if (!event) {
            throw new AppError(404, 'Event not found');
          }
          const user = req.user as { role: string; userId: string };
          if (user.role !== 'ADMIN' && event.createdBy !== user.userId) {
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
  async getEvents(req: Request, res: Response) {
    try {
      const events = await prisma.event.findMany({
        include: {
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
      res.json(events);
    } catch (error) {
      throw new AppError(500, 'Failed to get events');
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const event = await prisma.event.findUnique({ where: { id: req.params.id } });
      if (!event) {
        throw new AppError(404, 'Event not found');
      }
      const user = req.user as { role: string; userId: string };
      if (user.role !== 'ADMIN' && event.createdBy !== user.userId) {
        throw new AppError(403, 'Access denied');
      }
      await prisma.event.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      throw new AppError(500, 'Failed to delete event');
    }
  }
}

export const eventController = new EventController();
