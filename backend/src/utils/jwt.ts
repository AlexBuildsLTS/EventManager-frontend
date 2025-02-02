// Existing code...

// Import necessary modules. Generally available in most JWT libs
import * as jwt from 'jsonwebtoken';

// Function to verify JWT
function verifyJWT(token: string, secret: string): any {
 try {
    const decoded = jwt.verify(token, secret);
    return decoded;
 } catch (error) {
    // Handle verification errors (e.g., expired token, invalid signature)
    return null;
 }
}

// Export for other modules
export { verifyJWT };




// Existing code...
// Function to generate JWT
function generateJWT(payload: any, secret: string, expiresIn: string): string {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
}

// Export for other modules
export { generateJWT };
