import { Prisma } from '@prisma/client';
import { prisma } from '../database/db.js';

export class EmailLogService {
    async create(data: Prisma.EmailLogCreateInput) {
        try {
            await prisma.emailLog.create({ data });
        } catch (error) {
            console.error('Error creating email log:', error);
            throw error; // Re-throw the error to be handled elsewhere
        }
    }

    async update(id: string, data: Prisma.EmailLogUpdateInput) { //This is correct.  The error was elsewhere.
        try {
            await prisma.emailLog.update({
                where: { id },
                data,
            });
        } catch (error) {
            console.error('Error updating email log:', error);
            throw error; // Re-throw the error
        }
    }
}

export const emailLogService = new EmailLogService();
export const emailLogCreateInput = emailLogService.create;
export const emailLogUpdate = emailLogService.update;
