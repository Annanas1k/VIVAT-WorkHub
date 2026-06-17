import dotenv from 'dotenv';
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes";
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import logRoutes from './routes/log.routes';
import customersRoutes from './routes/customer.routes';
import commentRoutes from './routes/comment.routes';
import attachmentRoutes from "./routes/attachment.routes";
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes'
import path from 'path';

const morgan = require('morgan');

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

// ─── HTTP Server + Socket.io ───────────────────────────────
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    socket.join(`user_${userId}`);
    console.log(`🔌 User ${userId} conectat → room user_${userId}`);
  }

  socket.on('disconnect', () => {
    console.log(`❌ User ${userId} deconectat`);
  });
});

// ─── Middlewares ───────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ─── Routes ───────────────────────────────────────────────
app.get('/h', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'lucreaza!',
    timestamp: new Date().toISOString(),
  });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use("/api/attachments", attachmentRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/comments', commentRoutes);

// ─── 404 ──────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `${req.originalUrl} not found` });
});

// ─── Start ────────────────────────────────────────────────
// înlocuiești app.listen cu httpServer.listen
httpServer.listen(PORT, () => {
  console.log(`server start on url: http://localhost:${PORT}`);
});

export default app;