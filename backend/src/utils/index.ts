import express, { Express, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import { userRoutes } from '../routes/userRoutes.js';
import { invitationRoutes } from '../routes/invitationRoutes.js';
import errorMiddleware from '../middleware/index.js';
import dotenv from 'dotenv';
import { eventRoutes } from '../routes/eventRoutes.js';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use(urlencoded({ extended: true }));

// Add routes
app.use('/api/users', userRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

