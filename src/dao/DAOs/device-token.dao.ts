import { Prisma, type device_tokens } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class DeviceTokenDao extends BaseDao<
  device_tokens,
  Prisma.device_tokensCreateInput,
  Prisma.device_tokensUpdateInput,
  Prisma.device_tokensWhereUniqueInput
> {
  constructor() {
    super(prisma.device_tokens);
  }

  async findByUser(user_id: string): Promise<device_tokens[]> {
    return prisma.device_tokens.findMany({ where: { user_id } });
  }

  async upsertToken(user_id: string, token: string, device_type: string, app_version?: string): Promise<device_tokens> {
    return prisma.device_tokens.upsert({
      where: { user_id_token: { user_id, token } },
      update: { last_used: new Date(), app_version: app_version ?? null },
      create: {
        users: { connect: { user_id } },
        token,
        device_type,
        app_version: app_version ?? null,
      },
    });
  }

  async removeToken(user_id: string, token: string): Promise<void> {
    await prisma.device_tokens.delete({ where: { user_id_token: { user_id, token } } });
  }

  async removeAllForUser(user_id: string): Promise<Prisma.BatchPayload> {
    return prisma.device_tokens.deleteMany({ where: { user_id } });
  }
}
