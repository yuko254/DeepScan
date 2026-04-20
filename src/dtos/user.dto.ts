import * as user from "../validations/user.validation.js"
import { z } from 'zod';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const UpdateUserSchema = z.object({  
  username: user.usernameField.optional(),
  email: user.emailField.optional(),
})

export const DeleteUserSchema = z.object({  
  username: user.usernameField,
  email: user.emailField,
})

export const SearchUserSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const PasswordSchema = z.object({ oldPass: user.passwordField, newPass: user.passwordField });

// ─── Inferred types ───────────────────────────────────────────────────

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type SearchUserInput = z.infer<typeof SearchUserSchema>;
export type PasswordInput = z.infer<typeof PasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────
export interface UserResponseDto {
  user_id: string
  username: string
  email: string
  role: string | null | undefined
}