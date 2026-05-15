import { z } from 'zod';
import * as user from "../validations/user.validation.js"
import * as zod from "../validations/validation.js";
import type * as Dto from "./dto.js";
import type { UserFiltersDto } from "./searchFilters.dto.js";
import { UpsertProfileSchema, type ProfileDto } from "./profile.dto.js";

// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetUserParam = z.object({
  user_id: zod.UUID,
});

export const GetUsersQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  role_id: zod.ID.optional(),
  search: z.string().optional(),
}).transform(({ role_id, search, ...rest }) => ({
  ...rest,
  filters: { role_id, search } as UserFiltersDto,
}));

export const UserAccountSchema = z.object({ 
  username: user.usernameField,
  email: user.emailField,
  password: user.passwordField,

  user_id: z.undefined(),
  role_id: z.undefined(),
  created_at: z.undefined()
});

export const AdminCreateUserAccountSchema = UserAccountSchema.extend({ 
  role_id: zod.ID,
});

export const UpdateUserAccountSchema = z.object({ 
  username: user.usernameField.optional(),
  email: user.emailField.optional(),

  password: z.undefined(),
  user_id: z.undefined(),
  role_id: z.undefined(),
  created_at: z.undefined(),
});

export const AdminUpdateUserAccountSchema = UpdateUserAccountSchema.extend({
  password: user.passwordField.optional(),
  role_id: zod.ID.optional(), 
});

export const AdminUpdateUserSchema = AdminUpdateUserAccountSchema.extend({ 
  profile: UpsertProfileSchema.nullable().optional(), 
});

export const ChangePasswordSchema = z.object({ 
  oldPass: user.passwordField, 
  newPass: user.passwordField
});

export const RoleSchema = z.object({
  role_id: zod.ID,
  role_name: z.string().min(1),
});

// ─── Inferred types ───────────────────────────────────────────────────

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;

export type UserAccountBody = z.infer<typeof UserAccountSchema>;
export type AdminCreateUserAccountBody = z.infer<typeof AdminCreateUserAccountSchema>;

export type UpdateUserAccountBody = z.infer<typeof UpdateUserAccountSchema>;
export type AdminUpdateUserAccountBody = z.infer<typeof AdminUpdateUserAccountSchema>;

export type AdminUpdateUserBody = z.infer<typeof AdminUpdateUserSchema>;
export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface RoleDto {
  role_id: bigint;
  role_name: string;
}

export interface UserAccountDto {
  user_id: string
  username: string
  email: string
  role: RoleDto | null;
}

export interface UserDto extends UserAccountDto {
  profile: ProfileDto | null;
}

export interface UsersAccountsPageDto {
  users: UserAccountDto[]
  pagination: Dto.PageDto
}