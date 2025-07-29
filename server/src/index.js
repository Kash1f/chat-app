import express from 'express';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authenticateSocket from './middleware/socketAuth.js';
import handleSocketConnection from './utils/socket.js';
import { connectDB } from './lib/db.js';

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket"]
});

//middleware
app.use(cors());
app.use(express.json());

//api routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

console.log('Setting up Socket.IO authentication and connection handler...');
io.use(authenticateSocket);
io.on('connection', (socket) => handleSocketConnection(socket, io));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB().catch(err => console.error('DB connection failed:', err));
});
