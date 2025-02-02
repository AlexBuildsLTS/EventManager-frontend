// Handles email sending logic
import { sendEmail } from './emailService';

export const sendWelcomeEmail = async (recipientEmail: string, recipientName: string) => {
  const subject = 'Welcome to Our Platform!';
  const body = `Hi ${recipientName},\n\nWelcome to our platform! We're excited to have you.\n\nBest,\nThe Team`;

  try {
    await sendEmail(recipientEmail, subject, body);
    console.log(`Welcome email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${recipientEmail}:`, error);
  }
};


export const sendPasswordResetEmail = async (recipientEmail: string, resetLink: string) => {

  const subject = "Password Reset Request";
  const body = `Hi,\n\nYou recently requested to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nIf you didn't make this request, you can ignore this email.\n\nBest,\nThe Team`;

  try {
    await sendEmail(recipientEmail, subject, body);
    console.log(`Password reset email sent to ${recipientEmail}`);

  } catch (error) {
        console.error(`Error sending password reset email to ${recipientEmail}:`, error);
  }
};

