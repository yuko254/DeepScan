import { z } from 'zod';
import * as user from "../zod/fields/user.fields.js"

export const RegisterSchema = z.strictObject({
  username: user.usernameField,
  email: user.emailField,
  password: user.passwordField,
  stayLoggedIn: z.boolean().optional()
});

export const LoginSchema = z.strictObject({
  username: user.usernameField.optional(),
  email: user.emailField.optional(),
  password: z.string().min(1, 'Password is required'), // weaker on purpose — no length hint on login
  stayLoggedIn: z.boolean().optional()
});

export const ForgotPasswordSchema = z.strictObject({
  email: user.emailField,
});

export const ResetPasswordSchema = z.strictObject({
  email: user.emailField,
  token: z.string().min(1, 'Token is required'),
  newPassword: user.passwordField,
});

export const RefreshTokenSchema = z.strictObject({ 
  refresh_token: z.string().min(1, 'Token is required')
});

// ─── Types ───
export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;