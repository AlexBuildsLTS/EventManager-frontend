import { Invitation, Event, User, EmailLog, EmailStatus } from '@prisma/client';
import { emailTrackingService } from './EmailTrackingService.js';
import ical from 'ical-generator';
import { prisma } from '../database/db.js';
import nodemailer from 'nodemailer';

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export class EmailService {
    async sendEmail(to: string, subject: string, html: string, attachments?: any) {
        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                html,
                attachments,
            });

            console.log('Message sent: %s', info.messageId);

            await emailTrackingService.create({ recipientEmail: to, subject, messageId: info.messageId, status: 'SENT' } as any);

            return info.messageId;
        } catch (error: any) {
            console.error('Error sending email: ', error);

            const messageId = error?.response?.messageId ?? 'unknown';
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Update the email status to 'FAILED' in the email tracking service
            try {
                await emailTrackingService.updateByMessageId(messageId, { status: 'FAILED', error: errorMessage });
            } catch (updateError) {
                //Should ideally retry here.
                console.error('Error updating email tracking:', updateError);
            }

            throw error;
        }
    }

    private async logEmail(invitationId: string, status: EmailStatus, error?: string): Promise<EmailLog> {
        return await prisma.emailLog.create({
            data: {
                invitationId,
                status,
                error: error || '',
            },
        });
    }

    private generateICalEvent(event: Event) {
        const calendar = ical({ name: 'Event Invitation' });

        calendar.createEvent({
            start: event.date,
            end: new Date(event.date.getTime() + 2 * 60 * 60 * 1000),
            summary: event.title,
            description: event.description,
            location: event.location,
            url: `${process.env.FRONTEND_URL}/events/${event.id}`,
        });

        return calendar.toString();
    }

    async sendInvitationEmail(invitation: Invitation & { event: Event & { creator: User }; user: User }) {
        try {
            const { event, user } = invitation;
            const icalEvent = this.generateICalEvent(event);

            const messageId = await this.sendEmail(
                user.email,
                `Invitation: ${event.title}`,
                `<h1>You're Invited!</h1>
                <p>Hello ${user.firstName},</p>
                <p>You have been invited to ${event.title} by ${event.creator.firstName} ${event.creator.lastName}.</p>
                <h2>Event Details</h2>
                <p><strong>Date:</strong> ${event.date.toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Dress Code:</strong> ${event.dressCode}</p>
                <h3>Agenda</h3>
                <p>${event.topic || ''}</p>
                <h3>Costs</h3>
                <ul>${Object.entries(event.cost as unknown as Record<string, number>).map(([item, cost]) => `<li>${item}: ${cost} kr</li>`).join('')}</ul>
                <p>Please respond to this invitation by clicking one of the following links:</p>
                <p>
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/accept">Accept</a> |
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/maybe">Maybe</a> |
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/decline">Decline</a>
                </p>
                <p>You can also add this event to your calendar using the attached calendar invitation.</p>`,
                [{ filename: 'event.ics', content: icalEvent, contentType: 'text/calendar' }],
            );

            await emailTrackingService.create({ recipientEmail: user.email, subject: `Invitation: ${event.title}`, messageId, status: 'SENT' } as any);

            await this.logEmail(invitation.id, EmailStatus.SENT);
        } catch (error) {
            await this.logEmail(invitation.id, EmailStatus.ERROR, error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    async sendReminderEmail(invitation: Invitation & { event: Event; user: User }) {
        try {
            const { event, user } = invitation;

            const messageId = await this.sendEmail(
                user.email,
                `Reminder: ${event.title}`,
                `<h1>Event Reminder</h1>
                <p>Hello ${user.firstName},</p>
                <p>This is a reminder that you haven't responded to the invitation for ${event.title}.</p>
                <p>The event is scheduled for ${event.date.toLocaleString()}</p>
                <p>Please respond by clicking one of the following links:</p>
                <p>
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/accept">Accept</a> |
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/maybe">Maybe</a> |
                  <a href="${process.env.FRONTEND_URL}/invitations/${invitation.id}/decline">Decline</a>
                </p>`,
            );

            await emailTrackingService.create({ recipientEmail: user.email, subject: `Reminder: ${event.title}`, messageId, status: 'SENT' } as any);

            await this.logEmail(invitation.id, EmailStatus.REMINDER_SENT);
        } catch (error) {
            await this.logEmail(invitation.id, EmailStatus.REMINDER_ERROR, error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    async sendStatusUpdateEmail(invitation: Invitation & { event: Event & { creator: User }; user: User }) {
        try {
            const { event, user } = invitation;

            await this.sendEmail(
                event.creator.email,
                `Response Update: ${event.title}`,
                `<h1>Invitation Response Update</h1>
                <p>Hello ${event.creator.firstName},</p>
                <p>${user.firstName} has ${invitation.status.toLowerCase()} your invitation to ${event.title}.</p>
                ${invitation.comment ? `<p>Comment: "${invitation.comment}"</p>` : ''}
                ${invitation.drinkSelection ? `<h3>Drink Selections</h3>
                <ul>${Object.entries(invitation.drinkSelection as unknown as Record<string, number>).filter(([_, quantity]) => quantity > 0).map(([drink, quantity]) => `<li>${drink}: ${quantity}</li>`).join('')}</ul>` : ''}
                <p>View all responses <a href="${process.env.FRONTEND_URL}/events/${event.id}">here</a>.</p>`,
            );

            await this.logEmail(invitation.id, EmailStatus.UPDATE_SENT);
        } catch (error) {
            await this.logEmail(invitation.id, EmailStatus.UPDATE_ERROR, error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
}

export const emailService = new EmailService();
