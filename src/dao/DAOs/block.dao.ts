import { Prisma, type blocks } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class BlockDao extends BaseDao<
  blocks,
  Prisma.blocksCreateInput,
  Prisma.blocksUpdateInput,
  Prisma.blocksWhereUniqueInput
> {
  constructor() {
    super(prisma.blocks);
  }

  async block(blocker_id: string, blocked_id: string): Promise<blocks> {
    return prisma.blocks.create({
      data: {
        users_blocks_blocker_id: { connect: { user_id: blocker_id } },
        users_blocks_blocked_id: { connect: { user_id: blocked_id } },
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
}
