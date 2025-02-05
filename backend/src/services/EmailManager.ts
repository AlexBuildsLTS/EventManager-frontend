import { EmailService } from './EmailService';
import { InvitationService } from './InvitationService';
import { InvitationStatus, Invitation } from '@prisma/client';
import { User } from "@prisma/client";

export class EmailManager {
    constructor(private emailService: EmailService, private invitationService: InvitationService) { }

    async handleInvitationEmail(invitationId: string): Promise<Invitation | null> { // Return null if not found
        const invitation = await this.invitationService.getInvitationById(invitationId);
        if (!invitation) {
            return null; // Return null instead of throwing an error
        }
        return invitation;
    }

    async sendInvitationEmail(invitation: Invitation, user: User): Promise<boolean> { // Return true if email was sent
        try {
            // Implement email sending logic here using this.emailService
            const emailSent = await this.emailService.sendEmail(
                user.email,
                "Invitation",
                "You are invited!"
            ); // Example

            if (emailSent) { // Check if the email service was successful
                console.log("Invitation email sent for:", invitation);
                return true;
            } else {
                console.error("Failed to send invitation email for:", invitation);
                return false;
            }
        } catch (error) {
            console.error("Error sending invitation email:", error);
            return false; // Return false if there's an error
        }
    }
}

export const emailService = new EmailService();
export const invitationService = new InvitationService();
