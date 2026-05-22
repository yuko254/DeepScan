// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import type { accessPayload } from '../dtos/jwt.dto.js';
import { UnauthorizedError, ForbiddenError } from '../types/appErrors.types.js';
import { userRepo } from '../Repository/instances.js';

declare global {
  namespace Express {
    interface Request {
      user?: accessPayload;
    }
  }
}

const authToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.access_token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid Authorization header');
      }
      token = authHeader.slice(7);
    }

    req.user = verifyAccessToken(token);
    return true;
  } catch (err) {
    next(err);
    return false;
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authres = authToken(req, res, next);
  if (!authres) return; // auth middleware already called next with error
  next();
}

export async function authenticateStrict(req: Request, res: Response, next: NextFunction) {
  // JWT check first
  const authres = authToken(req, res, next);
  if (!authres) return; // auth middleware already called next with error

  const user = await userRepo.findById(req.user!.user_id);
  if (!user) return next(new UnauthorizedError('User no longer exists'));
  next();
}

export function authenticateSoft(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.access_token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (token) {
      req.user = verifyAccessToken(token);
    } else {
      req.user = undefined;
    }
  } catch (err) {
    // Token invalid or expired – treat as unauthenticated
    req.user = undefined;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role?.role_name ?? "user")) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
}