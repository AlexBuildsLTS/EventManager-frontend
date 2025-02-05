export class AppError extends Error {
    statusCode: number;
    status!: number;

    constructor(statusCode: number, message: string) {
        // Call the parent constructor with the provided message
        super(message);
        // Set the error code
        this.statusCode = statusCode;
        // This is important for proper error stack tracing in some environments
        Error.captureStackTrace(this, this.constructor);
    }

}
