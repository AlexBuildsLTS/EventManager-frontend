import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../database/db.js';
import { AppError } from '../utils/appError';
import { generateToken } from '../utils/jwt.js';
import { JwtPayload } from '../utils/jwt.js';


export class AuthService {
    async login(email: string, password: string): Promise<string> {
        try {
            // Find the user by email
            const user = await prisma.user.findUnique({ where: { email } });

            // Check if user exists
            if (!user) {
                throw new AppError(404, 'User not found');
            }

            // Compare the provided password with the stored hash
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new AppError(401, 'Invalid password');
            }


            // Generate a JWT token
            const token = generateToken({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, '1h');

            // Return the token
            return token;

        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw AppErrors for consistent error handling
            } else {
                console.error('Unexpected error during login:', error);
                throw new AppError(500, 'Failed to login');
            }
        }
    }

    async register(email: string, password: string, firstName: string, lastName: string): Promise<void> {
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user in the database
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                },
            });
        } catch (error) {
            console.error('Error during registration:', error);
            throw new AppError(500, 'Failed to register user');
        }
    }
}

export const authService = new AuthService();
