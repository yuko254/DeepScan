import { type roles, Role } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class RoleRepo extends BaseRepository<typeof prisma.roles> {
  constructor() {
    super(prisma.roles, 'roles', 'role_id');
  }

  async findByName(role_name: Role) {
    return this.model.findUnique({ where: { role_name } });
  }

  async findAll() {
    return this.model.findMany({ orderBy: { role_id: 'asc' } });
  }

  async assignToUser(user_id: string, role_id: bigint) {
    await this.model.update({ where: { user_id }, data: { role_id } });
  }
}
