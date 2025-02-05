

import { Prisma, EmailLog } from '@prisma/client';
import { prisma } from '../database/db.js';
import { AppError } from '../utils/appError.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { EmailService } from './EmailService.js';

export class EmailTrackingService {
    [x: string]: any;
    async create(data: Prisma.EmailLogCreateInput): Promise<EmailLog> {
        try {
            return await prisma.emailLog.create({ data });
        } catch (error) {
            console.error('Error creating email log:', error);
            throw new AppError(500, 'Failed to create email log');
        }
    }

    async update(where: Prisma.EmailLogWhereUniqueInput, data: Prisma.EmailLogUpdateInput): Promise<EmailLog | null> {
        try {
            return await prisma.emailLog.update({
                where,
                data,
            });
        } catch (error) {
            console.error('Error updating email log:', error);
            throw new AppError(500, 'Failed to update email log');
        }
    }
}

export const emailTrackingService = new EmailTrackingService();
