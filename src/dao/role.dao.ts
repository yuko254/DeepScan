import { Prisma, type roles } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class RoleDao extends BaseDao<
  roles,
  Prisma.rolesCreateInput,
  Prisma.rolesUpdateInput,
  Prisma.rolesWhereUniqueInput
> {
  constructor() {
    super(prisma.roles);
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
