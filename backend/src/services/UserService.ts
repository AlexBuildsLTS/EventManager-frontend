import {Prisma, User} from '@prisma/client';
import {prisma} from '../database/db.js';
import {AppError} from '../utils/appError';
import {hashPassword} from '../utils/passwordUtils.js';
import {sendEmail} from '../utils/email.js';

// Service to handle user-related operations
export class UserService {
    _buffer: any;
    exportUsersToCsv() {
        throw new Error('Method not implemented.');
    }

    importUsers(buffer: any) {
        this._buffer = buffer;
        throw new Error('Method not implemented.');
    }
    // Find a user by their ID
    async findUser(id: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({where: {id}});
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new AppError(500, 'Failed to fetch user');
        }
    }

    // Fetch all users from the database
    // Fetch all users from the database
    async getAllUsers(): Promise<User[]> {
        try {
            return await prisma.user.findMany();
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new AppError(500, 'Failed to fetch users');
        }
    }

    // Fetch a specific user by their ID
    async getUser(id: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({where: {id}});
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new AppError(500, 'Failed to fetch user');
        }
    }

    // Create a new user
    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        try {
            // Hash the password before storing it
            const hashedPassword = await hashPassword(data.password);
            const user = await prisma.user.create({
                data: {...data, password: hashedPassword },
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new AppError(500, 'Failed to create user');
        }
    }

    // Update an existing user
    private datapassword: boolean | undefined;
    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
        try {
            // If updating the password, hash it first
            if
            (this.datapassword) {
                // @ts-ignore
                [data.password] = await Promise.all([hashPassword(this.datapassword)]);
            }
            const [updatedUser] = await Promise.all([prisma.user.update({
                where: {id},
                data,
            })]);
            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            throw new AppError(500, 'Failed to update user');
        }
    }

    // Delete a user
    async deleteUser(id: string): Promise<void> {
        try {
            await prisma.user.delete({ where: { id } });
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new AppError(500, 'Failed to delete user');
        }
    }

    // Change a user's password
    async changeUserPassword(id: string, newPassword: string): Promise<void> {
        try {
            const hashedPassword = await hashPassword(newPassword);
            await prisma.user.update({
                where: { id },
                data: { password: hashedPassword },
            });
        } catch (error) {
            console.error('Error changing password:', error);
            throw new AppError(500, 'Failed to change password');
        }
    }

    // Send a new password to the user's email
    async sendNewUserPassword(id: string): Promise<void> {
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new AppError(404, 'User not found');
            }

            // Generate a new random password
            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await hashPassword(newPassword);

            // Update the user's password in the database
            await prisma.user.update({
                where: { id },
                data: { password: hashedPassword },
            });

            // Send the new password to the user's email
            await sendEmail({
                from: process.env.EMAIL_USER!,
                to: user.email,
                subject: 'Your New Password',
                text: `Your new password is: ${newPassword}`,
            });
        } catch (error) {
            console.error('Error sending new password:', error);
            throw new AppError(500, 'Failed to send new password');
        }
    }
}

// Export an instance of the UserService
export const userService = new UserService();