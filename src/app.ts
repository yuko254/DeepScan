import express from 'express';
import { createServer } from 'http';
import { expressMiddleware } from '@as-integrations/express5';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as env from "./config/env.js";

import RedisClient from './config/redis.js';
import { prisma } from './config/prisma.js';
import { initBucket } from './config/MinIo.js'
import tyex from 'tyex';
import nodox from 'nodox-cli';
import { apiReference } from '@scalar/express-api-reference';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';
import { createGraphQLServer, createContext } from "./graphql/server.js";

import { errorMiddleware } from './middlewares/error.middleware.js';
import { jsonParser } from './middlewares/jsonParser.middleware.js';
import { authenticateSoft, authenticateStrict,  requireRole } from "./middlewares/auth.middleware.js"

const app = express();
const httpServer = createServer(app);
const graphqlServer = await createGraphQLServer(httpServer);

await initBucket()


// ─── Middleware ───────────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(cors({ origin: env.ClientOrigin,credentials: true }));
app.use(jsonParser);
app.use(cookieParser());
app.use(nodox(app))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', async (req, res, next) => {
  const healthStatus = {
    server: 'OK',
    database: 'DOWN',
    redis: 'DOWN',
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. Check Prisma (Postgres)
    // $queryRaw is the fastest way to ping without fetching data
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.database = 'OK';
  } catch (error: any) {
    healthStatus.database = `DOWN: ${error}`;
  }

  try {
    // 2. Check Redis
    const redis = RedisClient.getInstance();
    const redisPing = await redis.ping();
    if (redisPing === 'PONG') {
      healthStatus.redis = 'OK';
    }
  } catch (error: any) {
    healthStatus.redis = `DOWN: ${error}`;
  }
    // Determine status code
    const isHealthy = healthStatus.database === 'OK' && healthStatus.redis === 'OK';
    res.status(isHealthy ? 200 : 503).json(healthStatus);
});

app.use('/graphql', authenticateSoft, expressMiddleware(graphqlServer, { context: createContext }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', authenticateStrict, requireRole("admin", "moderator"), adminRoutes);
app.use('/upload', authenticateStrict, uploadsRoutes);

// tyex OpenAPI spec generation
app.get('/openapi.json', (req, res) => {
  const spec = (tyex as any).oasGenerator(app, {
    info: {
      title: "Project API",
      version: "1.0.0"
    }
  });
  res.json(spec);
});
// Scalar Reference
app.use('/api-docs', apiReference({
  spec: { url: '/openapi.json' }
} as any));

// ─── Error handler ─────────────────────────────────────────────
app.use(errorMiddleware);

export { app, httpServer };