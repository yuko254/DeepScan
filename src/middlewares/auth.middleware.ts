import type { Request, Response, NextFunction } from 'express';
import { accessPayload } from '../validations/jwt.schema.js';
import { UnauthorizedError, ForbiddenError } from '../types/appErrors.types.js';
import { userRepo } from '../Repository/instances.js';
import { extractAndVerifyToken } from '../utils/token.util.js';

declare global {
  namespace Express {
    interface Request {
      user?: accessPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const user = extractAndVerifyToken(req);
  if (!user) throw new UnauthorizedError('Missing or invalid Authorization header');
  req.user = user;
  next();
}

export async function authenticateStrict(req: Request, res: Response, next: NextFunction) {
  const user = extractAndVerifyToken(req);
  if (!user) throw new UnauthorizedError('Missing or invalid Authorization header');
  const dbUser = await userRepo.findById(user.user_id);
  if (!dbUser) throw new UnauthorizedError('User no longer exists');
  req.user = user;
  next();
}

export function authenticateSoft(req: Request, res: Response, next: NextFunction) {
  const user = extractAndVerifyToken(req);
  req.user = user || undefined;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) throw new UnauthorizedError('Authentication required');
  next();
}

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError('Authentication required');
    if (!allowedRoles.includes(req.user.role ?? "user")) throw new ForbiddenError('Insufficient permissions');
    next();
  };
}