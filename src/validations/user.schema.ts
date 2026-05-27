import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';
import * as pagination from "./fields/pagination.fields.js";
import * as user from "./fields/user.fields.js";
import { LocationCreateSchema, LocationUpsertSchema } from './location.schema.js';

// ─── Profile ───
export const ProfileCreateSchema = z.strictObject({
  is_private: z.boolean().default(false).optional(),
  bio: z.string().max(500, 'Bio can have at most 500 characters').nullish(),
  avatar: z.url('Invalid avatar URL').nullish(),
  first_name: z.string().max(50, 'First name must be at most 50 characters'),
  last_name: z.string().max(50, 'Last name must be at most 50 characters'),
  phone_number: z.string().max(20, 'Phone number must be at most 20 characters').nullish(),
  birth_date: z.coerce.date().nullish(),
  birth_location: LocationCreateSchema.nullish(),
  current_location: LocationCreateSchema.nullish(),
});

export const ProfileUpdateSchema = ProfileCreateSchema.partial().extend({
  profile_id: IdSchema.uuid('profileId'),
  birth_location: LocationUpsertSchema.nullish(),
  current_location: LocationUpsertSchema.nullish(),
});

export const ProfileUpsertSchema = z.union([
  ProfileCreateSchema,
  ProfileUpdateSchema,
]);

// ─── User ───
export const UserAccountCreateSchema = z.strictObject({ 
  username: user.usernameField,
  email: user.emailField,
  password: user.passwordField,
});

export const UserAccountUpdateSchema = z.strictObject({ 
  username: user.usernameField.optional(),
  email: user.emailField.optional(),
});

// ─── Admin user ───
export const AdminUserAccountCreateSchema = UserAccountCreateSchema.extend({ 
  role_id: IdSchema.number('roleId')
});

export const AdminUserCreateSchema = AdminUserAccountCreateSchema.extend({ 
  profile: ProfileCreateSchema.nullish(),
});

export const AdminUserAccountUpdateSchema = UserAccountUpdateSchema.extend({
  password: user.passwordField.optional(),
  role_id: IdSchema.number('roleId').optional(),
  is_banned: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const AdminUserUpdateSchema = AdminUserAccountUpdateSchema.extend({
  profile: ProfileUpsertSchema.nullish(),
});

// ─── Role ───
export const RoleCreateSchema = z.strictObject({
  role_name: user.roleNameField
});

export const RoleUpdateSchema = z.strictObject({
  role_id: IdSchema.number('roleId'),
  role_name: user.roleNameField
});

// ─── Password ───
export const ChangePasswordSchema = z.strictObject({ 
  oldPass: user.passwordField, 
  newPass: user.passwordField
});

// ─── Searches ───
export const UserAccountsQuerySchema = z.strictObject({
  page: pagination.pageQuery,
  limit: pagination.pageLimitQuery,
  search: z.string().optional(),
  role: IdSchema.number('roleId').optional(),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
}).transform(({ role, search, isActive, isBanned, ...rest }) => ({
  ...rest,
  filters: { role_id: role, username: search, is_active: isActive, is_banned: isBanned },
}));

// ─── ID Params ───
export const ProfileIdParamSchema = z.strictObject({
  profile_id: IdSchema.uuid('profileId'),
});

export const UserIdParamSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
});

export const RoleIdParamSchema = z.strictObject({
  role_id: IdSchema.number('roleId'),
});

// ─── Types ───
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
export type ProfileUpsert = z.infer<typeof ProfileUpsertSchema>;

export type UserAccount = z.infer<typeof UserAccountCreateSchema>;
export type UserAccountUpdate = z.infer<typeof UserAccountUpdateSchema>;
export type UserAccountsQuery = z.infer<typeof UserAccountsQuerySchema>;

export type AdminUserAccountCreate = z.infer<typeof AdminUserAccountCreateSchema>;
export type AdminUserAccountUpdate = z.infer<typeof AdminUserAccountUpdateSchema>;
export type AdminUserCreate = z.infer<typeof AdminUserCreateSchema>;
export type AdminUserUpdate = z.infer<typeof AdminUserUpdateSchema>;

export type RoleCreate = z.infer<typeof RoleCreateSchema>;
export type RoleUpdate = z.infer<typeof RoleUpdateSchema>;

export type PasswordChange = z.infer<typeof ChangePasswordSchema>;