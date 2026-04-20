import { Prisma, type password_resets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class PasswordResetDao extends BaseDao<
  password_resets,
  Prisma.blocksCreateInput,
  Prisma.blocksUpdateInput,
  Prisma.blocksWhereUniqueInput
> {
  async createNew(user_id: string, token: string): Promise<void> {
    // delete any existing tokens for this user first
    await prisma.password_resets.deleteMany({ where: { user_id } });

    await prisma.password_resets.create({
      data: {
        user_id,
        token,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });
  }

  async findByToken(token: string) {
    return prisma.password_resets.findUnique({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.password_resets.delete({ where: { token } });
  }
}