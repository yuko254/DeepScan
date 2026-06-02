import express from 'express';
import { createServer } from 'http';
import { expressMiddleware } from '@as-integrations/express5';
import nodox from 'nodox-cli'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as env from "./config/env.js";

import RedisClient from './config/redis.js';
import { prisma } from './config/prisma.js';
import { initBucket } from './config/MinIo.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';
import { createGraphQLServer, createContext } from "./graphql/server.js";

import { missingResourceMiddleware } from './middlewares/missingResource.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { jsonParser } from './middlewares/jsonParser.middleware.js';
import { authenticateSoft, authenticateStrict, requireRole } from "./middlewares/auth.middleware.js";

const app = express();
const httpServer = createServer(app);
const graphqlServer = await createGraphQLServer(httpServer);
await initBucket();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(nodox(httpServer))
app.use(cors({ origin: env.ClientOrigin, credentials: true }));
app.use(jsonParser);
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  const healthStatus = {
    server: 'OK',
    database: 'DOWN' as string,
    redis: 'DOWN' as string,
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.database = 'OK';
  } catch (error: any) {
    healthStatus.database = `DOWN: ${error}`;
  }

  try {
    const redis = RedisClient.getInstance();
    if (await redis.ping() === 'PONG') healthStatus.redis = 'OK';
  } catch (error: any) {
    healthStatus.redis = `DOWN: ${error}`;
  }

  const isHealthy = healthStatus.database === 'OK' && healthStatus.redis === 'OK';
  res.status(isHealthy ? 200 : 503).json(healthStatus);
});

app.use('/graphql', authenticateSoft, expressMiddleware(graphqlServer, { context: createContext }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', authenticateStrict, requireRole("admin", "moderator"), adminRoutes);
app.use('/upload', authenticateStrict, uploadsRoutes);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(missingResourceMiddleware);
app.use(errorMiddleware);

export { app, httpServer };