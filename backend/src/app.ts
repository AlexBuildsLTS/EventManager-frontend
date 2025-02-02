import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { eventRouter } from './routes/events.js';
import { invitationRouter } from './routes/invitations.js';
import { errorHandler } from './middleware/error.js';
import dotenv from "dotenv";
import { prisma } from "./utils/prisma";

dotenv.config();
const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get ('/',
    (req, res) => {
      res.send ('API is running');
    });

// Routes
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/invitations', invitationRouter);

// Error handling
app.use(errorHandler);

export default app;
