import { type users, Prisma } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';
import { userFilterMapping, type UserFiltersDto } from "../../dtos/searchFilters.dto.js";

export class UserRepo extends BaseRepository<typeof prisma.users> {
  protected filterMapping = userFilterMapping;
  constructor() {
    super(prisma.users, 'users', 'user_id');
  }

  async findAccount(user_id: string) {
    return await this.model.findUnique({
      where: { user_id },
      include: { role: true }
    });
  }

  async findUser(user_id: string) {
    return await this.model.findUnique({
      where: { user_id },
      include: {
        role: true,
        profile: {
          include: {
            birth_location_details: {
              include: {
                city: true,
                country: true
              }
            },
            current_location_details: {
              include: {
                city: true,
                country: true
              }
            }
          }
        },
      }
    });
  }

  async findAccountByEmail(email: string) {
    return this.model.findUnique({ where: { email }, include: { role: true } });
  }

  async findAccountByUsername(username: string) {
    return this.model.findUnique({ where: { username }, include: { role: true } });
  }

  async getPage(take: number, skip: number, filters?: UserFiltersDto) {
    const where = this.buildWhere(filters);
    return await this.model.findMany({
      take,
      skip,
      where,
      include: { role: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async countByFilter(filters?: UserFiltersDto) {
    return this.model.count({ where: this.buildWhere(filters) });
  }

  async ban(user_id: string) {
    return this.model.update({ where: { user_id }, data: { is_banned: true }, include: { role: true } });
  }

  async unban(user_id: string) {
    return this.model.update({ where: { user_id }, data: { is_banned: false }, include: { role: true } });
  }

  async deactivate(user_id: string) {
    return this.model.update({ where: { user_id }, data: { is_active: false }, include: { role: true } });
  }

  async reactivate(user_id: string) {
    return this.model.update({ where: { user_id }, data: { is_active: true }, include: { role: true } });
  }
}
