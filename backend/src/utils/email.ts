import { createTransport } from 'nodemailer';

interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // Create a transporter using your email provider's SMTP settings
    const transporter = createTransport({
      service: 'gmail', // e.g., 'gmail', 'yahoo', 'outlook'
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });


    // Send the email
    const info = await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log('Email sent:', info.messageId);

  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}


// Example usage:
// (async () => {
//   try {
//     await sendEmail({
//       from: 'your_email@gmail.com',
//       to: 'recipient_email@example.com',
//       subject: 'Test Email',
//       text: 'This is a test email.',
//       html: '<h1>This is a test email in HTML</h1>',
//     });
//   } catch (error) {
//     console.error("Caught error:", error);
//   }
// })();

export default sendEmail;
