import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../types/appErrors.types.js';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Validation error',
      details: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Known app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // JWT errors
  if (err instanceof JsonWebTokenError) {
    const message = err instanceof TokenExpiredError
      ? 'Token expired'
      : 'Invalid token';
    res.status(401).json({ error: message });
    return;
  }

  // prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025')
      res.status(404).json({ error: 'Record not found' });
    else if (err.code === 'P2002')
      res.status(409).json({ error: 'Record already exists' });
    else if (err.code === 'P2003')
      res.status(409).json({ error: 'Cannot delete, record has dependent data' });
    return;
  }

  // Unknown errors – log and respond
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}