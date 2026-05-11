import { Prisma, type roles } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class RoleRepo extends BaseRepository<
  typeof prisma.roles
> {
  constructor() {
    super(prisma.roles, 'roles', 'role_id');
  }

  async findByName(role_name: string): Promise<roles | null> {
    return prisma.roles.findUnique({ where: { role_name } });
  }

  async findAll(): Promise<roles[]> {
    return prisma.roles.findMany({ orderBy: { role_name: 'asc' } });
  }

  async assignToUser(user_id: string, role_id: bigint): Promise<void> {
    await prisma.users.update({ where: { user_id }, data: { role_id } });
  }
}
