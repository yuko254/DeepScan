import { type blocks } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class BlockRepo extends BaseRepository<typeof prisma.blocks> {
  constructor() {
    super(prisma.blocks, 'blocks', undefined);
  }

  async findById(): Promise<never> {
    throw new Error('BlockRepo does not support findById — use findUnique with composite key { blocker_id, blocked_id }');
  }

  async block(blocker_id: string, blocked_id: string): Promise<blocks> {
    return prisma.blocks.create({
      data: {
        blocker: { connect: { user_id: blocker_id } },
        blocked: { connect: { user_id: blocked_id } },
      },
    });
  }

  async unblock(blocker_id: string, blocked_id: string): Promise<blocks> {
    return prisma.blocks.delete({ where: { blocker_id_blocked_id: { blocker_id, blocked_id } } });
  }

  async isBlocked(blocker_id: string, blocked_id: string): Promise<boolean> {
    const block = await prisma.blocks.findUnique({
      where: { blocker_id_blocked_id: { blocker_id, blocked_id } },
    });
    return block !== null;
  }

  async getBlockedUsers(blocker_id: string): Promise<blocks[]> {
    return prisma.blocks.findMany({ where: { blocker_id } });
  }

  async getBlockedByUsers(blocked_id: string): Promise<blocks[]> {
    return prisma.blocks.findMany({ where: { blocked_id } });
  }

  /** Check either direction — useful for feed filtering */
  async isBlockedEither(user_id_a: string, user_id_b: string): Promise<boolean> {
    const count = await prisma.blocks.count({
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
