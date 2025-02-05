import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { AppError } from './utils/appError';
import { invitationRoutes } from './routes/invitationRoutes.js';
import { emailRoutes } from './routes/emailRoutes.js';

const app = express();


app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/emails', emailRoutes);

// Error handling middleware
app.use((err: AppError, _req: any, res: any, _next: any) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        message
    });
});


// Export the app for testing purposes AND for starting the server in index.ts
export default app;
