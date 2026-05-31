<<<<<<< HEAD
import { type blocks } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
=======
import { Prisma, prisma } from '../../config/prisma.js';
>>>>>>> dev
import { BaseRepository } from './BaseRepository.repo.js';

export class BlockRepo extends BaseRepository<typeof prisma.blocks> {
  constructor() {
    super(prisma.blocks, 'blocks', undefined);
  }

<<<<<<< HEAD
  async findById() {
=======
  override async findById(): Promise<never> {
>>>>>>> dev
    throw new Error('BlockRepo does not support findById — use findUnique with composite key { blocker_id, blocked_id }');
  }

  async block(blocker_id: string, blocked_id: string) {
    return this.model.create({
<<<<<<< HEAD
      data: {
        blocker: { connect: { user_id: blocker_id } },
        blocked: { connect: { user_id: blocked_id } },
      },
=======
      data: { blocker_id, blocked_id },
>>>>>>> dev
    });
  }

  async unblock(blocker_id: string, blocked_id: string) {
    return this.model.delete({ where: { blocker_id_blocked_id: { blocker_id, blocked_id } } });
  }

<<<<<<< HEAD
=======
  async findBlockedUsers(blocker_id: string, limit: number, cursor?: Date) {
    const where: Prisma.blocksWhereInput = {
      blocker_id,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const blocks = await this.model.findMany({
      take: limit,
      where,
      include: { blocked: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = blocks.length === limit
      ? blocks[blocks.length - 1]?.created_at
      : null;

    return { blocks, nextCursor };
  }

  async findBlockEitherIds(user_id: string) {
    const blocks = await this.model.findMany({
      where: {
        OR: [
          { blocker_id: user_id },
          { blocked_id: user_id }
        ]
      },
      select: {
        blocker_id: true,
        blocked_id: true
      }
    });

    const blockedUsers = new Set<string>();
    const blockedBy = new Set<string>();

    for (const block of blocks) {
      if (block.blocker_id === user_id) {
        blockedUsers.add(block.blocked_id);
      } else {
        blockedBy.add(block.blocker_id);
      }
    }

    return { blockedBy, blockedUsers };
  }

>>>>>>> dev
  async isBlocked(blocker_id: string, blocked_id: string) {
    const block = await this.model.findUnique({
      where: { blocker_id_blocked_id: { blocker_id, blocked_id } },
    });
    return block !== null;
  }

<<<<<<< HEAD
  async getBlockedUsers(blocker_id: string) {
    return this.model.findMany({ where: { blocker_id } });
  }

  async getBlockedByUsers(blocked_id: string) {
    return this.model.findMany({ where: { blocked_id } });
  }

  /** Check either direction — useful for feed filtering */
=======
>>>>>>> dev
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
