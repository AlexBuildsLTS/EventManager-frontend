import app from "./app";

const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

server.on('error', (error: any) => {
    console.error('Server startup error:', error);
    process.exit(1); // Exit the process on a server error
});
