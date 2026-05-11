import { z } from 'zod';
import { type UserAccountDto } from "./users.dto.js";
import * as user from "../validations/user.validation.js"
import * as token from "../validations/tokens.validation.js"

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

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────
export interface TokensDto {
  access_token: string;
  refresh_token: string;
  jti: string;
}

export interface AuthDto {
  user: UserAccountDto;
  tokens: TokensDto;
}