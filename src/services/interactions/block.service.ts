import { Prisma, prisma } from '../../config/prisma.js';
import * as AppError from '../../types/appErrors.types.js';

class BlockService {

  async blockUser(blockerId: string, blockedId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Check if trying to block yourself
      if (blockerId === blockedId) {
        throw new AppError.BadRequestError('You cannot block yourself');
      }

      // Check if user exists
      const targetUser = await tx.users.findUnique({
        where: { user_id: blockedId }
      });
      if (!targetUser) throw new AppError.NotFoundError('User not found');

      // Check if already blocked
      const existingBlock = await tx.blocks.findUnique({
        where: {
          blocker_id_blocked_id: {
            blocker_id: blockerId,
            blocked_id: blockedId
          }
        }
      });

      if (existingBlock) {
        throw new AppError.ConflictError('User already blocked');
      }

      // Create block
      const block = await tx.blocks.create({
        data: {
          blocker_id: blockerId,
          blocked_id: blockedId
        }
      });

      // If they were following each other, remove the follow relationship
      await tx.follows.deleteMany({
        where: {
          OR: [
            { follower_id: blockerId, following_id: blockedId },
            { follower_id: blockedId, following_id: blockerId }
          ]
        }
      });

      // Remove any pending follow requests
      await tx.follow_requests.deleteMany({
        where: {
          OR: [
            { requester_id: blockerId, target_id: blockedId },
            { requester_id: blockedId, target_id: blockerId }
          ]
        }
      });

      return { success: true, blocked: true, block };
    });
  }

  async unblockUser(blockerId: string, blockedId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const deleted = await tx.blocks.deleteMany({
        where: {
          blocker_id: blockerId,
          blocked_id: blockedId
        }
      });

      if (deleted.count === 0) {
        throw new AppError.NotFoundError('Block not found');
      }

      return { success: true, unblocked: true };
    });
  }

  async getBlockedUsers(userId: string, limit: number, cursor?: Date,) {
    const blocks = await prisma.blocks.findMany({
      where: {
        blocker_id: userId,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: { blocked: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = blocks.length === limit
      ? blocks[blocks.length - 1]?.created_at
      : null;

    return { users: blocks.map(b => b.blocked), nextCursor };
  }

  async getBlockedUserIds(userId: string): Promise<string[]> {
    const blocks = await prisma.blocks.findMany({
      where: { blocker_id: userId },
      select: { blocked_id: true }
    });
    return blocks.map(b => b.blocked_id);
  }

  async checkIfBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const block = await prisma.blocks.findUnique({
      where: {
        blocker_id_blocked_id: {
          blocker_id: blockerId,
          blocked_id: blockedId
        }
      }
    });
    return !!block;
  }

  async checkIfEitherBlocked(userId1: string, userId2: string): Promise<boolean> {
    const [block1, block2] = await Promise.all([
      prisma.blocks.findUnique({
        where: {
          blocker_id_blocked_id: {
            blocker_id: userId1,
            blocked_id: userId2
          }
        }
      }),
      prisma.blocks.findUnique({
        where: {
          blocker_id_blocked_id: {
            blocker_id: userId2,
            blocked_id: userId1
          }
        }
      })
    ]);

    return !!(block1 || block2);
  }

  async getBlockCount(userId: string): Promise<number> {
    return await prisma.blocks.count({
      where: { blocker_id: userId }
    });
  }

  async getBlocksReceived(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const blocks = await prisma.blocks.findMany({
      where: { blocked_id: userId },
      include: {
        blocker: {
          include: { profile: true }
        }
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.blocks.count({
      where: { blocked_id: userId }
    });

    return { blockedBy: blocks, total };
  }
}

export const blockService = new BlockService();