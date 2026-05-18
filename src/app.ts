import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
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
import { graphqlServer } from "./graphql/server.js";

import { errorMiddleware } from './middlewares/error.middleware.js';
import { authenticateStrict, requireRole, authenticate } from "./middlewares/auth.middleware.js"

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
    healthStatus.database = `DOWN: ${error.code}`;
  }

  try {
    // 2. Check Redis
    const redis = RedisClient.getInstance();
    const redisPing = await redis.ping();
    if (redisPing === 'PONG') {
      healthStatus.redis = 'OK';
    }
  } catch (error: any) {
    healthStatus.redis = `DOWN: ${error.code}`;
  }
    // Determine status code
    const isHealthy = healthStatus.database === 'OK' && healthStatus.redis === 'OK';
    res.status(isHealthy ? 200 : 503).json(healthStatus);
});

await graphqlServer.start();
app.use('/graphql', authenticate,
  expressMiddleware(graphqlServer, {
    context: async ({ req }) => ({
      user: req.user ?? null,
      prisma,
    }),
  })
);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', authenticateStrict, requireRole("admin", "moderator"), adminRoutes);



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