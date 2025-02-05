// backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { JwtPayload } from '../models/index.js';

// Extend the Express Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: 'ADMIN' | 'MEMBER';
            };
        }
    }
}

const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from the authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Split the string and take the second part

        // Check if the token is missing or invalid
        if (!token) {
            throw new AppError(401, 'Authentication failed: Missing token.');
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // Attach the user to the request object
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Handle invalid tokens
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Handle other errors
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Authentication failed.' });
    }
};

export default authMiddleware;
