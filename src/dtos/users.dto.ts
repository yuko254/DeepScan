import { z } from 'zod';
import * as user from "../validations/user.validation.js"
import * as zod from "../validations/validation.js";
import type * as Dto from "./dto.js";
import type * as prisma from "./prismaRes.dto.js";
import type { UserFiltersDto } from "./searchFilters.dto.js";
import { CreateProfileSchema, UpsertProfileSchema, toProfileDto, type ProfileDto } from "./profile.dto.js";
import type { Roles, Users } from '../graphql/graphql.js';


// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetUserParam = z.object({
  user_id: zod.UUID,
});

export const GetUsersQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  search: z.string().optional(),
  role: zod.ID.optional(),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
}).transform(({ role, search, isActive, isBanned, ...rest }) => ({
  ...rest,
  filters: { role_id: role, username: search, is_active: isActive, is_banned: isBanned } as UserFiltersDto,
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

export const AdminCreateUserSchema = AdminCreateUserAccountSchema.extend({ 
  profile: CreateProfileSchema.nullable().optional()
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
  is_banned: z.boolean().optional(),
  is_active: z.boolean().optional(),
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
export type AdminCreateUserBody = z.infer<typeof AdminCreateUserSchema>;

export type UpdateUserAccountBody = z.infer<typeof UpdateUserAccountSchema>;
export type AdminUpdateUserAccountBody = z.infer<typeof AdminUpdateUserAccountSchema>;
export type AdminUpdateUserBody = z.infer<typeof AdminUpdateUserSchema>;

export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type RoleDto = Pick<Roles, 'role_id' | 'role_name'>;
export function toRoleDto(role: prisma.PrismaRole): RoleDto {
  return {
    role_id: role.role_id,
    role_name: role.role_name as RoleDto['role_name'],
  };
}

export type UserAccountDto = Pick<Users, 'user_id' | 'username' | 'email'> & { role: RoleDto | null; };
export function toUserAccountDto(user: prisma.PrismaUserAccount): UserAccountDto {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role ? toRoleDto(user.role) : null
  };
}

export type UserDto = UserAccountDto & { profile: ProfileDto | null; };
export function toUserDto(user: prisma.PrismaUser): UserDto {
  return {
    ...toUserAccountDto(user),
    profile: user.profile ? toProfileDto(user.profile) : null
  };
}

// Admin response DTOs

export type AdminUserAccountDto = UserAccountDto & {
  is_active: boolean;
  is_banned: boolean;
  created_at: Date;
  updated_at: Date;
};
export function toAdminUserAccountDto(user: prisma.PrismaUserAccount): AdminUserAccountDto {
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    is_active: user.is_active,
    is_banned: user.is_banned,
    created_at: user.created_at,
    updated_at: user.updated_at,
    role: user.role ? toRoleDto(user.role) : null
  };
};

export type AdminUserDto = AdminUserAccountDto & { profile: ProfileDto | null; };
export function toAdminUserDto(user: prisma.PrismaUser): AdminUserDto {
  return {
    ...toAdminUserAccountDto(user),
    profile: user.profile ? toProfileDto(user.profile) : null
  };
}

export interface AdminUsersAccountsPageDto {
  users: AdminUserAccountDto[];
  pagination: Dto.PageDto;
}
