import { Prisma, prisma } from '../../config/prisma.js';
import { blockRepo, followRepo, followRequestRepo } from '../../Repository/instances.js';
import * as AppError from '../../types/appErrors.types.js';

class BlockService {

  async blockUser(blockerId: string, blockedId: string, tx?: Prisma.TransactionClient) {
    if (blockerId === blockedId) throw new AppError.BadRequestError('You cannot block yourself');

    return (tx || prisma).$transaction(async (tx) => {

      const block = await blockRepo.withTx(tx).block(blockerId, blockedId).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') throw new AppError.ConflictError('User already blocked');
          if (e.code === 'P2003') throw new AppError.NotFoundError('User not found');
        }
        throw e;
      });

      await followRepo.withTx(tx).unfollowBoth(blockerId, blockedId);
      await followRequestRepo.withTx(tx).deleteBoth(blockerId, blockedId);

      return block;
    });
  }

  async unblockUser(blockerId: string, blockedId: string, tx?: Prisma.TransactionClient) {
    await blockRepo.withTx(tx).unblock(blockerId, blockedId).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Block not found');
      }
      throw e;
    });

    return true;
  }

  async getBlockedUsers(userId: string, limit: number, cursor?: Date) {
    const { blocks, nextCursor } = await blockRepo.findBlockedUsers(userId, limit, cursor);
    return { users: blocks.map(b => b.blocked), nextCursor };
  }

  async checkIfBlocked(blockerId: string, blockedId: string) {
    return blockRepo.isBlocked(blockerId, blockedId);
  }

  async checkIfEitherBlocked(blockerId: string, blockedId: string) {
    return blockRepo.isBlockedEither(blockerId, blockedId);
  }
}

export const blockService = new BlockService();