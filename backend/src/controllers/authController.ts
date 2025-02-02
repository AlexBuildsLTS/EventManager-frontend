import { Request, Response } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8), // Enforce a minimum password length
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(2), // Add validation for other fields
});

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    // ... rest of your login logic
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors }); // Return detailed validation errors
    }
    // ... other error handling
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username } = registerSchema.parse(req.body);
    // ... rest of your register logic
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors }); // Return detailed validation errors
    }
    // ... other error handling
  }
}

//Remember to install express: npm install express --save
