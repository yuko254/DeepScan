import { type users, Prisma } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';
import type { UserFiltersDto } from "../../dtos/searchFilters.dto.js";

export class UserRepo extends BaseRepository<typeof prisma.users> {
  constructor() {
    super(prisma.users, 'users', 'user_id');
  }

  private buildWhere(filters?: UserFiltersDto): Prisma.usersWhereInput {
    const where: Prisma.usersWhereInput = {};
    if (filters?.role_id) where.role = { role_id: filters.role_id };
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
        role: true,
      },
    });
    if (!res) return null;
    return { user_id: res.user_id, username: res.username, email: res.email, role: res.role ?? null };
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
          omit: { user_id: true, created_at: true, birth_location_id: true, current_location_id: true },
        },
        role: true,
      },
      omit: { password: true, role_id: true },
    });
    if (!res) return null;
    return { user_id: res.user_id, username: res.username, email: res.email, role: res.role ?? null, profile: res.profile ?? null };
  }

  async findByEmail(email: string): Promise<users | null> {
    return prisma.users.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<users | null> {
    return prisma.users.findUnique({ where: { username } });
  }

  async getPage(take: number, skip: number, filters?: UserFiltersDto) {
    const where = this.buildWhere(filters);
    const res = await prisma.users.findMany({
      take,
      skip,
      where,
      select: { user_id: true, username: true, email: true, role: true },
      orderBy: { created_at: 'desc' },
    });
    return res.map((r) => ({ user_id: r.user_id, username: r.username, email: r.email, role: r.role ?? null }));
  }

  async countByFilter(filters?: UserFiltersDto): Promise<number> {
    return prisma.users.count({ where: this.buildWhere(filters) });
  }

  async ban(user_id: string): Promise<users> {
    return prisma.users.update({ where: { user_id }, data: { is_banned: true } });
  }

  async unban(user_id: string): Promise<users> {
    return prisma.users.update({ where: { user_id }, data: { is_banned: false } });
  }

  async deactivate(user_id: string): Promise<users> {
    return prisma.users.update({ where: { user_id }, data: { is_active: false } });
  }
}
