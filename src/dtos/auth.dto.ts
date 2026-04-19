import { z } from 'zod';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(60, 'Password must be at most 60 characters'),
});

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

export const LogoutSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

// ─── Inferred request types ───────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type LogoutInput = z.infer<typeof LogoutSchema>;

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
