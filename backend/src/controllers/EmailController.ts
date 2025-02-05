// backend/src/controllers/EmailController.ts

import { Request, Response } from 'express';
import { emailService } from '../services/EmailService.js';
import { AppError } from '../utils/appError';
import { z } from 'zod';

const sendEmailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    text: z.string()
})

export class EmailController {
    async sendEmail(req: Request, res: Response) {
        try {
            const { to, subject, text } = sendEmailSchema.parse(req.body);
            await emailService.sendEmail(to, subject, text);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error("Send email error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors });
            }
            res.status(500).json({ message: 'Failed to send email' });
        }
    }
}

export const emailController = new EmailController();