import type { Request, Response, NextFunction } from 'express';
import { mapErrorToResponse } from '../utils/errorMapper.util.js';

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  const { statusCode, message, details } = mapErrorToResponse(err);
  const response: any = { error: message };
  if (details) response.details = details;
  res.status(statusCode).json(response);
}