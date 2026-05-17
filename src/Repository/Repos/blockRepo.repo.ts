import { type blocks } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class BlockRepo extends BaseRepository<typeof prisma.blocks> {
  constructor() {
    super(prisma.blocks, 'blocks', undefined);
  }

  async findById() {
    throw new Error('BlockRepo does not support findById — use findUnique with composite key { blocker_id, blocked_id }');
  }

  async block(blocker_id: string, blocked_id: string) {
    return this.model.create({
      data: {
        blocker: { connect: { user_id: blocker_id } },
        blocked: { connect: { user_id: blocked_id } },
      },
    });
  }

  async unblock(blocker_id: string, blocked_id: string) {
    return this.model.delete({ where: { blocker_id_blocked_id: { blocker_id, blocked_id } } });
  }

  async isBlocked(blocker_id: string, blocked_id: string) {
    const block = await this.model.findUnique({
      where: { blocker_id_blocked_id: { blocker_id, blocked_id } },
    });
    return block !== null;
  }

  async getBlockedUsers(blocker_id: string) {
    return this.model.findMany({ where: { blocker_id } });
  }

  async getBlockedByUsers(blocked_id: string) {
    return this.model.findMany({ where: { blocked_id } });
  }

  /** Check either direction — useful for feed filtering */
  async isBlockedEither(user_id_a: string, user_id_b: string) {
    const count = await this.model.count({
      where: {
        OR: [
          { blocker_id: user_id_a, blocked_id: user_id_b },
          { blocker_id: user_id_b, blocked_id: user_id_a },
        ],
      },
    });
    return count > 0;
  }
}
