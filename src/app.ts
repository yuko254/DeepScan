import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { authenticate } from "./middlewares/auth.middleware.js"

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// app.use('/posts', postRoutes);
// app.use('/chats', chatRoutes);

// ─── Error handler ─────────────────────────────────────────────
app.use(errorMiddleware);

export default app