import * as Dto from "../dtos/dto.js";
import * as prisma from "../dtos/prismaRes.dto.js";
import { toProfileDto, ProfileDto } from "./profile.dto.js";
import type { Roles, Users } from '../graphql/generated/graphql.js';

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
