import { z } from 'zod';

export const usernameField = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores');

export const emailField = z.email('Invalid email address');

export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(60, 'Password must be at most 60 characters');