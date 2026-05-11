import { Prisma, type users } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';
import type { UserFiltersDto } from "../../dtos/searchFilters.dto.js";

export class UserRepo extends BaseRepository<
  typeof prisma.users
> {
  constructor() {
    super(prisma.users, 'users', 'user_id');
  }

  private buildWhere(filters?: UserFiltersDto): Prisma.usersWhereInput {
    const where: any = {};
    if (filters?.role_id) where.roles = { role_id: filters.role_id };
    if (filters?.search) where.username = { contains: filters.search, mode: 'insensitive' };
    return where;
  }

  async findWithRole(user_id: string) {
    const res = await prisma.users.findUnique({
      where: { user_id },
      select: {
        user_id: true,
        username: true,
        email: true,
        roles: true,
      },
    });

    if (!res) return null;
    return {
      user_id: res.user_id,
      username: res.username,
      email: res.email,
      role: res.roles ?? null,
    };
  }

  async findUser(user_id: string) {
    const res = await prisma.users.findUnique({
      where: { user_id },
      include: {
        profile: { 
          include: {
            birth_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
            current_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
          },
          omit: { user_id: true, created_at: true, birth_location_id: true, current_location_id: true } 
        },
        roles: true,
      },
      omit: { password: true, role_id: true }
    });

    if (!res) return null;
    
    return {
      user_id: res.user_id,
      username: res.username,
      email: res.email,
      role: res.roles ?? null,
      profile: res.profile ?? null
    };
  }

  async getPage(take: number, skip: number, filters?: UserFiltersDto) {
    const where = this.buildWhere(filters);
    const res = await prisma.users.findMany({
      take: take,
      skip: skip,
      where: where,
      select: {
        user_id: true,
        username: true,
        email: true,
        roles: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!res) return [];
    return res.map(r => ({
      user_id: r.user_id,
      username: r.username,
      email: r.email,
      role: r.roles ?? null,
    }));
  }

  async countByFilter(filters?: UserFiltersDto): Promise<number> {
    const where = this.buildWhere(filters);
    return prisma.users.count({ where });
  }
}
