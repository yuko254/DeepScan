import { Prisma, prisma } from '../../config/prisma.js';
import { followRepo, followRequestRepo, blockRepo, userRepo } from '../../Repository/instances.js';
import * as AppError from '../../types/appErrors.types.js';

class FollowService {

  async getFollowers(userId: string, limit: number, cursor?: Date) {
    const { follows, nextCursor } = await followRepo.findFollowers(userId, limit, cursor);
    return { users: follows.map(f => f.follower), nextCursor };
  }

  async getFollowing(userId: string, limit: number, cursor?: Date) {
    const { follows, nextCursor } = await followRepo.findFollowing(userId, limit, cursor);
    return { users: follows.map(f => f.following), nextCursor };
  }

  async getIncomingFollowRequests(userId: string, limit: number, cursor?: Date) {
    const { requests, nextCursor } = await followRequestRepo.findIncomingRequests(userId, limit, cursor);
    return { requests, nextCursor };
  }

  async getOutgoingFollowRequests(userId: string, limit: number, cursor?: Date) {
    const { requests, nextCursor } = await followRequestRepo.findOutgoingRequests(userId, limit, cursor);
    return { requests, nextCursor };
  }

  async getFollowRequestStatus(userId: string, targetId: string) {
    const request = await followRequestRepo.findRequest(userId, targetId);
    if (request) return request.status;

    const isFollowing = await this.checkIfFollowing(userId, targetId);
    if (isFollowing) return 'accepted';

    return null;
  }

  async followUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
    if (followerId === followingId) throw new AppError.BadRequestError('You cannot follow yourself');

    return (tx || prisma).$transaction(async (tx) => {
      const isBlockedEither = await blockRepo.withTx(tx).isBlockedEither(followerId, followingId);
      if (isBlockedEither) throw new AppError.ForbiddenError('Blocked relationship exists between you and this user');

      const targetUser = await userRepo.withTx(tx).findUser(followingId);
      if (!targetUser) throw new AppError.NotFoundError('User not found');
      const isPrivate = targetUser.profile?.is_private || false;

      const isFollowing = await followRepo.withTx(tx).isFollowing(followerId, followingId);
      if (isFollowing) throw new AppError.ConflictError('Already following this user');

      if (isPrivate) {
        const existingRequest = await followRequestRepo.withTx(tx).findRequest(followerId, followingId);
        if (existingRequest) throw new AppError.ConflictError('Follow request already sent');

        const request = await followRequestRepo.withTx(tx).request(followerId, followingId);
        return { status: 'request_sent' };
      }

      const follow = await followRepo.withTx(tx).follow(followerId, followingId);
      return { status: 'following' };
    });
  }

  async unfollowUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
    if (followerId === followingId) throw new AppError.BadRequestError('You cannot unfollow yourself');

    return (tx || prisma).$transaction(async (tx) => {
      await followRepo.withTx(tx).unfollow(followerId, followingId).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('Not following this user');
        }
        throw e;
      });

      await followRequestRepo.withTx(tx).cancel(followerId, followingId).catch();

      return true;
    });
  }

  async acceptFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
    if (ownerId === requesterId) throw new AppError.BadRequestError('You cannot accept a follow request from yourself');

    return (tx || prisma).$transaction(async (tx) => {
      const request = await followRequestRepo.withTx(tx).findRequest(requesterId, ownerId);
      if (!request) throw new AppError.NotFoundError('Follow request not found');
      if (request.status !== 'pending') throw new AppError.BadRequestError(`Request already ${request.status}`);

      await followRequestRepo.withTx(tx).accept(requesterId, ownerId);

      const follow = await followRepo.follow(requesterId, ownerId);

      return follow;
    });
  }

  async rejectFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
    if (ownerId === requesterId) throw new AppError.BadRequestError('You cannot reject a follow request from yourself');

    await followRequestRepo.withTx(tx).reject(requesterId, ownerId).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Follow request not found');
      }
      throw e;
    });

    return true
  }

  async cancelFollowRequest(requesterId: string, targetId: string, tx?: Prisma.TransactionClient) {
    if (requesterId === targetId) throw new AppError.BadRequestError('You cannot cancel a follow request to yourself');

    await followRequestRepo.withTx(tx).cancel(requesterId, targetId).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('No pending follow request found');
      }
      throw e;
    });

    return true;
  }

  async checkIfFollowing(followerId: string, followingId: string): Promise<boolean> {
    return followRepo.isFollowing(followerId, followingId);
  }

  async checkFollowRequestStatus(requesterId: string, targetId: string) {
    return followRequestRepo.getStatus(requesterId, targetId);
  }

  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      followRepo.getFollowerCount(userId),
      followRepo.getFollowingCount(userId)
    ]);

    return { followersCount, followingCount };
  }
}

export const followService = new FollowService();