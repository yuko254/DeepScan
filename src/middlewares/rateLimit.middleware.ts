import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import RedisClient from '../config/redis.js';

const redis = RedisClient.getInstance();

// Common Redis store configuration
const redisStore = new RedisStore({
  // @ts-ignore
  client: redis,
});

// A stricter limiter for sensitive auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  store: redisStore,
  message: { error: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests against the limit
});

// An even stricter limiter specifically for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  store: redisStore,
  skipSuccessfulRequests: true, // Only count failed login attempts
  message: { error: 'Too many failed login attempts, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  store: new RedisStore({
    // @ts-ignore
    client: redis,
    prefix: 'rl:reset:',
  }),
  keyGenerator: (req) => {
    if (req.body?.email) return `reset:${req.body.email}`;
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `reset:ip:${ipKeyGenerator(ip)}`;
  },
  message: { error: 'Too many attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});