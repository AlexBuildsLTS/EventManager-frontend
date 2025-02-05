import nodemailer from 'nodemailer';

// Create a Nodemailer transporter with the configuration from environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Asynchronous function to send emails using the transporter
export const sendEmail = async (options: { from: string; to: string; subject: string; text: string; }) => {
    try {
        // Send the email using the provided options
        await transporter.sendMail(options);
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error sending email:', error);
        // Throw a new error indicating the failure to send the email
        throw new Error('Failed to send email');
    }
};
