import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
 


interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

interface AuthParams {
  req: Request;
  res: Response;
  next: NextFunction;
}

export const auth = ({ req, res, next }: AuthParams) => {
  try {
    const token = req.header ('Authorization')?.split (' ')[1];

    if (!token) {
      throw new AppError (401, 'Authentication required');
    }

    req.user = jwt.verify (token, process.env.JWT_SECRET!) as JwtPayload;
    next ();
  } catch (error) {
    next (new AppError (401, 'Invalid or expired token'));
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next (new AppError (403, 'Admin access required'));
  }
  next ();
};

export const ownerOrAdmin = (resourceUserId: string) => (req: Request, res: Response, next: NextFunction) =>  {
  if (req.user?.role !== 'ADMIN' && req.user?.userId !== resourceUserId) {
    return next(new AppError(403, 'Only the owner or an admin can access this resource.'));
  };
  next();
};


export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof Error && error.name === 'AppError') {
    return res.status(error.statusCode).json({
      error: error.message
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'A record with this value already exists'
      });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found'
      });
    }
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error'
  });
};export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not Found') as any;
  error.statusCode = 404;
  error.name = 'AppError';
  next(error);
};

class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export default { auth, adminOnly, ownerOrAdmin, errorHandler, notFound };
