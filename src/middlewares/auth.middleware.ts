// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import type { JwtPayload } from '../dtos/jwt.dto.js';
import { UnauthorizedError, ForbiddenError } from '../types/appErrors.types.js';
import { userDao } from '../dao/instances.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
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

export async function authenticateStrict(req: Request, res: Response, next: NextFunction) {
  // JWT check first
  authenticate(req, res, async () => {
    const user = await userDao.find({ user_id: req.user!.user_id });
    if (!user) return next(new UnauthorizedError('User no longer exists'));
    next();
  });
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  next();
}

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