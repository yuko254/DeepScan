import type { Request, Response, NextFunction } from 'express';
import { mapErrorToResponse } from '../utils/errorMapper.util.js';

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  const { statusCode, message, code, details } = mapErrorToResponse(err);

  const response = {
    success: false,
    message,
    code,
    statusCode,
    details: details ?? undefined
  };

  res.status(statusCode).json(response);
}