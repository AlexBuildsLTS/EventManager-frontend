import jwt from 'jsonwebtoken';
import { JwtPayload } from '../models/index';

// Function to generate a JWT token
export const generateToken = (payload: any, secret: string, expiresIn: string | number): string => {
    return jwt.sign(payload, secret, { expiresIn: Number(expiresIn) });

};

;

// Function to verify a JWT token
export const verifyToken = (token: string, secret: string): JwtPayload | string => { // Added type for return
    try {
        const decoded = jwt.verify(token, secret);
        return decoded as JwtPayload; // Type assertion for decoded payload
    } catch (error) {
        return "Invalid token"; // Or throw the error if you prefer: throw new Error('Invalid token');
    }
};

export { JwtPayload };
export { jwt };
