import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as env from "./config/env.js";

import RedisClient from './config/redis.js';
import { prisma } from './config/prisma.js';
import tyex from 'tyex';
import nodox from 'nodox-cli';
import { apiReference } from '@scalar/express-api-reference';


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

import { errorMiddleware } from './middlewares/error.middleware.js';
import { authenticateStrict, requireRole } from "./middlewares/auth.middleware.js"

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: env.ClientOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(nodox(app))

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', authenticateStrict, requireRole("admin"), adminRoutes);

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
  } catch (error) {
    healthStatus.database = `DOWN: ${error.code}`;
  }

  try {
    // 2. Check Redis
    const redis = RedisClient.getInstance();
    const redisPing = await redis.ping();
    if (redisPing === 'PONG') {
      healthStatus.redis = 'OK';
    }
  } catch (error) {
    healthStatus.redis = `DOWN: ${error.code}`;
  }
    // Determine status code
    const isHealthy = healthStatus.database === 'OK' && healthStatus.redis === 'OK';
    res.status(isHealthy ? 200 : 503).json(healthStatus);
});

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

export default app