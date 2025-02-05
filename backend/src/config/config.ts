import dotenv from 'dotenv';

dotenv.config();

const config = {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    email: {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
        smtpFrom: process.env.SMTP_FROM,
    },
    frontendUrl: process.env.FRONTEND_URL,
    passwordResetUrl: process.env.PASSWORD_RESET_URL,
    // Add other configuration variables as needed
};

export default config;