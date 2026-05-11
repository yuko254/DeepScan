import { Prisma, type device_tokens } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class DeviceTokenRepo extends BaseRepository<
  typeof prisma.device_tokens
> {
  constructor() {
    super(prisma.device_tokens, 'device_tokens', 'token_id');
  }

  async findByUser(user_id: string): Promise<device_tokens[]> {
    return prisma.device_tokens.findMany({ where: { user_id } });
  }

  async upsertToken(user_id: string, token: string, device_type: string, app_version?: string): Promise<device_tokens> {
    return prisma.device_tokens.upsert({
      where: { user_id_token: { user_id, token } },
      update: { last_used: new Date(), app_version: app_version ?? null },
      create: {
        user: { connect: { user_id } },
        token,
        device_type,
        app_version: app_version ?? null,
      },
    });
  }

  async removeToken(user_id: string, token: string): Promise<void> {
    await prisma.device_tokens.delete({ where: { user_id_token: { user_id, token } } });
    await prisma.device_tokens.deleteMany({ where: { user_id } });
  }
}
