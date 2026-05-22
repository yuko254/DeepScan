import { Prisma } from '../config/prisma.js';

function eq<W extends Record<string, any>, K extends keyof W>(
  field: K
): (value: W[K]) => W {
  return (value) => ({ [field]: value } as W);
}

export interface UserFiltersDto {
  username?: string;
  role_id?: number;
  is_active?: boolean;
  is_banned?: boolean;
}
export const userFilterMapping = {
  role_id:   (roleId: number) => ({ role: { role_id: roleId } }),
  username:  (username: string) => ({ username: { contains: username, mode: 'insensitive' } }),
  is_active: eq<Prisma.usersWhereInput, 'is_active'>('is_active'),
  is_banned: eq<Prisma.usersWhereInput, 'is_banned'>('is_banned'),
};

export interface ReportFiltersDto {
  status?: string;
  reporter_id?: string;
  resolver_id?: string | null;
  report_target_id?: string;
}
export const reportFilterMapping = {
  status:           eq<Prisma.reportsWhereInput, 'status'>('status'),
  reporter_id:      eq<Prisma.reportsWhereInput, 'reporter_id'>('reporter_id'),
  resolver_id:      eq<Prisma.reportsWhereInput, 'resolver_id'>('resolver_id'),
  report_target_id: eq<Prisma.reportsWhereInput, 'report_target_id'>('report_target_id'),
};

export interface CountryFiltersDto {
  search?: string;
}

export interface CityFiltersDto {
  search?: string;
  country_id?: number;
}