// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload } from '../utils/jwt.utils.js';
import { UnauthorizedError, ForbiddenError } from '../types/errors.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }
    const token = authHeader.slice(7);
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  next();
}

// Role guard factory
export async function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role_name ?? "user")) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}