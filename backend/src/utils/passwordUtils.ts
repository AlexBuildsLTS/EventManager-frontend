import bcrypt from 'bcrypt';

// Asynchronous function to hash a password using bcrypt
export const hashPassword = async (password: string) => {
    // Define the number of salt rounds for bcrypt
    const saltRounds = 10;
    // Hash the password using bcrypt with the specified salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Return the hashed password
    return hashedPassword;
};

// Asynchronous function to compare a plain text password with a hashed password using bcrypt
export const comparePassword = async (password: string, hash: string) => {
    // Use bcrypt to compare the plain text password with the hashed password
    const match = await bcrypt.compare(password, hash);
    // Return a boolean indicating whether the passwords match
    return match;
};