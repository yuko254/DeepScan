import { z } from 'zod';
<<<<<<< HEAD
=======
import { booleanString } from './fields/common.fields.js';
>>>>>>> dev
import * as user from "./fields/user.fields.js"

export const RegisterSchema = z.strictObject({
  username: user.usernameField,
  email: user.emailField,
  password: user.passwordField,
  first_name: z.string().max(50, 'First name must be at most 50 characters'),
  last_name: z.string().max(50, 'Last name must be at most 50 characters'),
<<<<<<< HEAD
  stayLoggedIn: z.boolean().optional()
=======
>>>>>>> dev
});

export const LoginSchema = z.strictObject({
  username: user.usernameField.optional(),
  email: user.emailField.optional(),
  password: z.string().min(1, 'Password is required'), // weaker on purpose — no length hint on login
<<<<<<< HEAD
  stayLoggedIn: z.boolean().optional()
});

export const ForgotPasswordSchema = z.strictObject({
=======
  stayLoggedIn: booleanString.optional()
});

export const RefreshTokenSchema = z.strictObject({ 
  refresh_token: z.string().min(1, 'Token is required')
});

export const emailSchema = z.strictObject({
>>>>>>> dev
  email: user.emailField,
});

export const ResetPasswordSchema = z.strictObject({
  email: user.emailField,
  token: z.string().min(1, 'Reset token is required'),
  newPassword: user.passwordField,
});

<<<<<<< HEAD
export const RefreshTokenSchema = z.strictObject({ 
  refresh_token: z.string().min(1, 'Token is required')
=======
export const VerifyEmailSchema = z.strictObject({
  token: z.string().min(1),
>>>>>>> dev
});

// ─── Types ───
export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
<<<<<<< HEAD
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;
=======
export type ForgotPasswordBody = z.infer<typeof emailSchema>;
>>>>>>> dev
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;