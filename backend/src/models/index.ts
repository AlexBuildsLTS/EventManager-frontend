import { RequestHandler } from "express";
import { UserService } from "../services/UserService.js";
import { AppError } from "../utils/appError";
import { verifyToken } from "../utils/jwt.js";
import * as Jwt from 'jsonwebtoken';

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ');

    // Check if the token is missing or invalid
    if (!token) {
      throw new AppError(401, 'Authentication failed: Missing token.');
    }
    // Verify the token
    const decoded = verifyToken(token[1], process.env.JWT_SECRET!) as JwtPayload;

    // Attach the user to the request object
    const user = await new UserService().findUser(decoded.userId);
    if (!user) {
      throw new AppError(401, 'Authentication failed: User not found.');
    }
    //Check if the user role matches the decoded token role
    if (user.role !== decoded.role) { throw new AppError(401, 'Authentication failed: User role mismatch.') }
    req.user = {
      id: user.id,
      role: decoded.role,
    };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid tokens
    if (error instanceof Jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Handle other errors
    console.error('Error during authentication:', error);
    res.status(500).json({ message: 'Authentication failed.' });
  }
};

export const adminOnly: RequestHandler = (req, res, next) => {
  // Check if the user is authenticated and has the admin role
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  } else {
    throw new AppError(403, 'Forbidden: Only admins can access this route.');
  }
};

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface Invitation {
  id: string;
  eventId: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  comment?: string;
  responseDate?: Date;
  emailStatus?: 'SENT' | 'ERROR';
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
  avatar?: string;
  title?: string;
  userLevel?: number;
}


export interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  participantIds: string
  createdBy: string
  dressCode: 'FORMAL' | 'SEMIFORMAL' | 'CASUAL';
  agenda: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'ADMIN' | 'MEMBER'
  avatar?: string
  title?: string
  userLevel?: number
}
