import { type device_tokens, DeviceType } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class DeviceTokenRepo extends BaseRepository<typeof prisma.device_tokens> {
  constructor() {
    super(prisma.device_tokens, 'device_tokens', 'token_id');
  }

  async findByUser(user_id: string) {
    return this.model.findMany({ where: { user_id } });
  }

  async upsertToken(
    user_id: string,
    token: string,
    device_type: DeviceType,
    app_version?: string,
  ) {
    return this.model.upsert({
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

  /** Remove a single token for this user */
  async removeToken(user_id: string, token: string) {
    // fix: original was deleting ALL user tokens after deleting one
    await this.model.delete({ where: { user_id_token: { user_id, token } } });
  }

  /** Remove all tokens for this user (e.g. on logout-all) */
  async removeAllTokens(user_id: string) {
    await this.model.deleteMany({ where: { user_id } });
  }

  async pruneStale(before: Date) {
    await this.model.deleteMany({ where: { last_used: { lt: before } } });
  }
}
