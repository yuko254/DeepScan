import { type users } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';
import { userFilterMapping, UserFiltersDto } from "../../dtos/searchFilters.dto.js";

export class UserRepo extends BaseRepository<typeof prisma.users> {
  protected filterMapping = userFilterMapping;
  constructor() {
    super(prisma.users, 'users', 'user_id');
  }

  private includeLite = {
    role: true,
    profile: true
  }

  private includeDetails = {
    role: true,
    profile: {
      include: {
        birth_location: { include: { city: true, country: true } },
        current_location: { include: { city: true, country: true } }
      }
    }
  }

  async findAccount(user_id: string) {
    return await this.model.findUnique({
      where: { user_id },
      include: { role: true }
    });
  }

  async findAccountByEmail(email: string) {
    return this.model.findUnique({
      where: { email },
      include: { role: true }
    });
  }

  async findAccountByUsername(username: string) {
    return this.model.findUnique({
      where: { username },
      include: { role: true }
    });
  }

  async findUser(user_id: string) {
    return await this.model.findUnique({
      where: { user_id },
      include: this.includeDetails
    });
  }

  async getPage(take: number, skip: number, filters?: UserFiltersDto) {
    const where = this.buildWhere(filters);
    return await this.model.findMany({
      take,
      skip,
      where,
      include: this.includeLite,
      orderBy: { created_at: 'desc' },
    });
  }

  async countByFilter(filters?: UserFiltersDto) {
    return this.model.count({ where: this.buildWhere(filters) });
  }

  async createAccount(data: Prisma.usersUncheckedCreateInput) {
    return this.model.create({
      data,
      include: { role: true }
    });
  }

  async updateAccount(user_id: string, data: Prisma.usersUncheckedUpdateInput) {
    return this.model.update({
      where: { user_id },
      data,
      include: { role: true }
    });
  }

  async searchUsers(search: string, limit: number, cursor?: Date) {
    const where: Prisma.usersWhereInput = {
      AND: [
        {
          OR: [
            { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { profile: { first_name: { contains: search, mode: Prisma.QueryMode.insensitive } } },
            { profile: { last_name: { contains: search, mode: Prisma.QueryMode.insensitive } } }
          ]
        },
        ...(cursor ? [{ created_at: { lt: cursor } }] : [])
      ]
    };

    const users = await this.model.findMany({
      take: limit,
      where,
      include: this.includeLite,
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = users.length === limit
      ? users[users.length - 1]?.created_at
      : null;

    return { users, nextCursor };
  }
}
