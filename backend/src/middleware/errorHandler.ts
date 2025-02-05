import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }

    res.status(500).json({
        message: 'Internal server error',
    });
};