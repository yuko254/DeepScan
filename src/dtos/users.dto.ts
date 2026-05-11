import { z } from 'zod';
import * as user from "../validations/user.validation.js"
import * as zod from "../validations/common.validation.js";
import type * as Dto from "./common.dto.js";
import type { UserFiltersDto } from "./filters.dto.js";
import { UpsertProfileSchema, type ProfileDto } from "./profile.dto.js";

// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetUserParam = z.object({
  user_id: zod.UUID,
});

export const GetUsersQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  role_id: z.bigint().optional(),
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
})

export const AdminCreateUserAccountSchema = UserAccountSchema.extend({ 
  role_id: z.bigint(), 
});

export const UpdateUserAccountSchema = z.object({ 
  username: user.usernameField.optional(),
  email: user.emailField.optional(),

  password: z.undefined(),
  user_id: z.undefined(),
  role_id: z.undefined(),
  created_at: z.undefined(),
})

export const AdminUpdateUserAccountSchema = UpdateUserAccountSchema.extend({
  password: user.passwordField.optional(),
  role_id: z.bigint().optional(), 
});

export const AdminUpdateUserSchema = AdminUpdateUserAccountSchema.extend({ 
  profile: UpsertProfileSchema.nullable().optional(), 
});

export const ChangePasswordSchema = z.object({ 
  oldPass: user.passwordField, 
  newPass: user.passwordField
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
  role_id: BigInt;
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