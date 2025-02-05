import { Request, RequestHandler, Response } from 'express';
import { userService } from '../services/UserService.js';
import { AppError } from '../utils/appError';
import { z } from 'zod';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const updateUserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
});

const createUserSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(2).refine((str) => str.trim() !== "", { message: "First name cannot be empty" }),
    lastName: z.string().min(2).refine((str) => str.trim() !== "", { message: "Last name cannot be empty" }),
    password: z.string().min(6).refine((str) => str.trim() !== "", { message: "Password cannot be empty" }),
    role: z.enum(["ADMIN", "USER"]).optional(),
});

export class UserController {
    getCurrentUser: any;
    importUsersFromCsv(arg0: string, auth: any, adminOnly: any, arg3: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, importUsers: (req: Request & { file: any; }, res: Response) => Promise<Response | void>, importUsersFromCsv: any): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> {
        throw new Error('Method not implemented.');
    }
    // [x: string]: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        //Implement login logic here
    }
    async getUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error("Get users error:", error);
            res.status(500).json({ message: 'Failed to fetch users' });
        }
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await userService.getUser(id);
            if (!user) {
                throw new AppError(404, 'User not found');
            }
            res.json(user);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                console.error("Get user error:", error);
                res.status(500).json({ message: 'Failed to fetch user' });
            }
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const data = createUserSchema.parse(req.body);
            const newUser = await userService.createUser(data);
            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors });
            } else {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Failed to create user' });
            }
        }
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const data = updateUserSchema.parse(req.body);
            const updatedUser = await userService.updateUser(id, data);
            if (!updatedUser) {
                throw new AppError(404, 'User not found');
            }
            res.json(updatedUser);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.errors });
            } else {
                console.error('Error updating user:', error);
                res.status(500).json({ error: 'Failed to update user' });
            }
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await userService.deleteUser(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    async changeUserPassword(req: Request, res: Response) {
        const { id } = req.params;
        const { newPassword } = req.body;
        try {
            await userService.changeUserPassword(id, newPassword);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ error: 'Failed to change password' });
        }
    }

    async sendNewUserPassword(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await userService.sendNewUserPassword(id);
            res.status(200).json({ message: 'New password sent successfully' });
        } catch (error) {
            console.error('Error sending new password:', error);
            res.status(500).json({ error: 'Failed to send new password' });
        }
    }

    async exportUsersToCsv(req: Request, res: Response) {
        try {
            const csvData = await userService.exportUsersToCsv();
            res.set('Content-Type', 'text/csv');
            res.set('Content-Disposition', 'attachment; filename=users.csv');
            res.send(csvData);
        } catch (error) {
            console.error('Error exporting users to CSV:', error);
            res.status(500).json({ error: 'Failed to export users to CSV' });
        }
    }

    async importUsers(req: Request & { file: any },
        res: Response): Promise<Response | void> {
        // Check if a file was uploaded
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        try {
            await userService.importUsers(req.file.buffer);
            return res.status(200).json({ message: 'Users imported successfully' });

        } catch (error) {
            console.error('Error importing users:', error);
            res.status(500).json({ error: 'Failed to import users' });
            return;
        }
    }
}
export const userController = new UserController();
