// backend/src/controllers/AuthController.ts

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { z } from 'zod';
import { authService } from '../services/AuthService.js';

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const registerSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2).refine((str) => str.trim()!== "", { message: "First name cannot be empty" }),
    lastName: z.string().min(2).refine((str) => str.trim()!== "", { message: "Last name cannot be empty" }),
    password: z.string().min(6).refine((str) => str.trim()!== "", { message: "Password cannot be empty" }),
    role: z.enum(["ADMIN", "USER"]).optional(),
});

export class AuthController {
    async login(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password } = loginSchema.parse(req.body);
            const token = await authService.login(username, password);
            res.json({ token });
        } catch (error) {
            console.error("Login error:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors });
            }
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('jwt');
        res.status(200).json({ message: 'Logged out' });
    }

    async register(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const data = registerSchema.parse(req.body);
            await authService.register(data.email, data.password, data.firstName, data.lastName);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ message: error.errors });
            }
            console.error("Registration error:", error);
            res.status(500).json({ message: 'Registration failed' });
        }
    }
}

export const authController = new AuthController();