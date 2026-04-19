import { Prisma, type refresh_tokens } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class RefreshTokenDao extends BaseDao<
  refresh_tokens,
  Prisma.refresh_tokensCreateInput,
  Prisma.refresh_tokensUpdateInput,
  Prisma.refresh_tokensWhereUniqueInput
> {
  constructor() {
    super(prisma.refresh_tokens);
  }

  async createToken(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.refresh_tokens.create({
      data: {
        token: data.token,
        expires_at: data.expiresAt,
        user: {
          connect: { user_id: data.userId },
        },
      },
    });
  }

  async findByToken(token: string) {
    return prisma.refresh_tokens.findUnique({ where: { token } });
  }

  async deleteByToken(token: string) {
    return prisma.refresh_tokens.delete({ where: { token } }).catch(() => null);
  }

  async deleteAllForUser(userId: string) {
    return prisma.refresh_tokens.deleteMany({ where: { user_id: userId } });
  }

  async deleteExpired() {
    return prisma.refresh_tokens.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });
  }
}