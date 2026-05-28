import { ZodError } from 'zod';
import { GraphQLError } from 'graphql';
import { AppError } from '../types/appErrors.types.js';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';

export function mapErrorToResponse(err: unknown): {
  success: false;
  message: string;
  code: string;
  details?: Array<{ field: string; message: string }>;
  statusCode: number;
} {
  // GraphQL validation errors
  if (err instanceof GraphQLError) {
    return {
      success: false,
      statusCode: 400,
      message: err.message,
      code: 'GRAPHQL_VALIDATION_ERROR',
    };
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return {
      success: false,
      statusCode: 422,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  // Known app errors
  if (err instanceof AppError) {
    return {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
    };
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    const message = err instanceof jwt.TokenExpiredError ? 'Token expired' : 'Invalid token';
    return {
      success: false,
      statusCode: 401,
      message,
      code: 'UNAUTHENTICATED',
    };
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return {
        success: false,
        statusCode: 404,
        message: 'Record not found',
        code: 'NOT_FOUND',
      };
    }
    if (err.code === 'P2002') {
      return {
        success: false,
        statusCode: 409,
        message: 'Record already exists',
        code: 'CONFLICT',
      };
    }
    if (err.code === 'P2003') {
      return {
        success: false,
        statusCode: 409,
        message: 'Foreign key constraint failed',
        code: 'CONFLICT',
      };
    }
  }

  // Unknown errors
  console.error(err);
  return {
    success: false,
    statusCode: 500,
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  };
}