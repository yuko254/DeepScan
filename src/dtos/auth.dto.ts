import * as user from "../validations/user.validation.js"
import * as token from "../validations/tokens.validation.js"
import { z } from 'zod';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  username: user.usernameField,
  email: user.emailField,
  password: user.passwordField,
});

export const LoginSchema = z.object({
  email: user.emailField,
  password: z.string().min(1, 'Password is required'), // weaker on purpose — no length hint on login
});

export const ForgotPasswordSchema = z.object({
  email: user.emailField,
});

export const ResetPasswordSchema = z.object({
  token: token.TokenField,
  new_password: user.passwordField,
});

export const RefreshTokenSchema = z.object({ refresh_token: token.TokenField });

// ─── Inferred request types ───────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface AuthUserDto {
  user_id: string;
  username: string;
  email: string;
  role_name: string | null;
}

export interface TokensDto {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  tokens: TokensDto;
}