import { ZodError } from 'zod';
import { AppError } from '../types/appErrors.types.js';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';

export function mapErrorToResponse(err: unknown): {
  statusCode: number;
  message: string;
  details?: any;
  extensions?: Record<string, any>;
} {
  // Zod validation errors
  if (err instanceof ZodError) {
    return {
      statusCode: 422,
      message: 'Validation error',
      details: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      extensions: { code: 'BAD_USER_INPUT', details: err.issues },
    };
  }

  // Known app errors
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      extensions: { statusCode: err.statusCode },
    };
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    const message = err instanceof jwt.TokenExpiredError ? 'Token expired' : 'Invalid token';
    return {
      statusCode: 401,
      message,
      extensions: { code: 'UNAUTHENTICATED' },
    };
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return { statusCode: 404, message: 'Record not found', extensions: { code: 'NOT_FOUND' } };
    }
    if (err.code === 'P2002') {
      return { statusCode: 409, message: 'Record already exists', extensions: { code: 'CONFLICT' } };
    }
    if (err.code === 'P2003') {
      return {
        statusCode: 409,
        message: 'Operation failed because record has dependent data',
        extensions: { code: 'CONFLICT' },
      };
    }
  }

  // Unknown errors – log but return generic message for clients
  console.error(err);
  return {
    statusCode: 500,
    message: 'Internal server error',
    extensions: { code: 'INTERNAL_SERVER_ERROR' },
  };
}