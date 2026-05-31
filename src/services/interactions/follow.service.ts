import { Prisma, prisma } from '../../config/prisma.js';
<<<<<<< HEAD
=======
import { followRepo, followRequestRepo, blockRepo, userRepo } from '../../Repository/instances.js';
>>>>>>> dev
import * as AppError from '../../types/appErrors.types.js';

class FollowService {

<<<<<<< HEAD
  private async isBlocked(tx: Prisma.TransactionClient, user1: string, user2: string): Promise<boolean> {
    const block = await tx.blocks.findUnique({
      where: {
        blocker_id_blocked_id: {
          blocker_id: user1,
          blocked_id: user2
        }
      }
    });
    return !!block;
  }

  async getFollowers(userId: string, limit: number, cursor?: Date) {
    const follows = await prisma.follows.findMany({
      where: {
        following_id: userId,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: { follower: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = follows.length === limit
      ? follows[follows.length - 1]?.created_at
      : null;

=======
  async getFollowers(userId: string, limit: number, cursor?: Date) {
    const { follows, nextCursor } = await followRepo.findFollowers(userId, limit, cursor);
>>>>>>> dev
    return { users: follows.map(f => f.follower), nextCursor };
  }

  async getFollowing(userId: string, limit: number, cursor?: Date) {
<<<<<<< HEAD
    const follows = await prisma.follows.findMany({
      where: {
        follower_id: userId,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: { following: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = follows.length === limit
      ? follows[follows.length - 1]?.created_at
      : null;

    return { users: follows.map(f => f.following), nextCursor };
  }

  async getMyFollowRequests(userId: string, limit: number, cursor?: Date) {
    const requests = await prisma.follow_requests.findMany({
      where: {
        target_id: userId,
        status: 'pending',
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: { requester: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = requests.length === limit
      ? requests[requests.length - 1]?.created_at
      : null;

=======
    const { follows, nextCursor } = await followRepo.findFollowing(userId, limit, cursor);
    return { users: follows.map(f => f.following), nextCursor };
  }

  async getIncomingFollowRequests(userId: string, limit: number, cursor?: Date) {
    const { requests, nextCursor } = await followRequestRepo.findIncomingRequests(userId, limit, cursor);
    return { requests, nextCursor };
  }

  async getOutgoingFollowRequests(userId: string, limit: number, cursor?: Date) {
    const { requests, nextCursor } = await followRequestRepo.findOutgoingRequests(userId, limit, cursor);
>>>>>>> dev
    return { requests, nextCursor };
  }

  async getFollowRequestStatus(userId: string, targetId: string) {
<<<<<<< HEAD
    const request = await prisma.follow_requests.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: userId,
          target_id: targetId
        }
      }
    });

=======
    const request = await followRequestRepo.findRequest(userId, targetId);
>>>>>>> dev
    if (request) return request.status;

    const isFollowing = await this.checkIfFollowing(userId, targetId);
    if (isFollowing) return 'accepted';

    return null;
  }

  async followUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
<<<<<<< HEAD
    return (tx || prisma).$transaction(async (tx) => {
      if (followerId === followingId) {
        throw new AppError.BadRequestError('You cannot follow yourself');
      }

      // Check if blocked (either direction)
      const [blockedByTarget, blockedByFollower] = await Promise.all([
        this.isBlocked(tx, followingId, followerId),
        this.isBlocked(tx, followerId, followingId)
      ]);

      if (blockedByTarget) {
        throw new AppError.ForbiddenError('Cannot follow user who has blocked you');
      }
      if (blockedByFollower) {
        throw new AppError.ForbiddenError('You have blocked this user');
      }

      const targetUser = await tx.users.findUnique({
        where: { user_id: followingId },
        include: { profile: true }
      });
      if (!targetUser) throw new AppError.NotFoundError('User not found');

      const existingFollow = await tx.follows.findUnique({
        where: {
          follower_id_following_id: {
            follower_id: followerId,
            following_id: followingId
          }
        }
      });

      if (existingFollow) {
        throw new AppError.ConflictError('Already following this user');
      }

      const isPrivate = targetUser.profile?.is_private || false;

      if (isPrivate) {
        const existingRequest = await tx.follow_requests.findUnique({
          where: {
            requester_id_target_id: {
              requester_id: followerId,
              target_id: followingId
            }
          }
        });

        if (existingRequest) {
          throw new AppError.ConflictError('Follow request already sent');
        }

        const request = await tx.follow_requests.create({
          data: {
            requester_id: followerId,
            target_id: followingId,
            status: 'pending'
          }
        });

        return {
          success: true,
          status: 'request_sent',
          followRequest: request
        };
      } else {
        const follow = await tx.follows.create({
          data: {
            follower_id: followerId,
            following_id: followingId
          }
        });

        return {
          success: true,
          status: 'following',
          follow
        };
      }
=======
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
>>>>>>> dev
    });
  }

  async unfollowUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
<<<<<<< HEAD
    return (tx || prisma).$transaction(async (tx) => {
      if (followerId === followingId) {
        throw new AppError.BadRequestError('You cannot unfollow yourself');
      }

      // Delete direct follow if exists
      const deletedFollow = await tx.follows.deleteMany({
        where: {
          follower_id: followerId,
          following_id: followingId
        }
      });

      // Also delete any pending follow request
      await tx.follow_requests.deleteMany({
        where: {
          requester_id: followerId,
          target_id: followingId
        }
      });

      if (deletedFollow.count === 0) {
        throw new AppError.NotFoundError('Not following this user');
      }

      return { success: true, unfollowed: true };
=======
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
>>>>>>> dev
    });
  }

  async acceptFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
<<<<<<< HEAD
    return (tx || prisma).$transaction(async (tx) => {
      // Check if blocked
      const blocked = await this.isBlocked(tx, ownerId, requesterId);
      if (blocked) {
        throw new AppError.ForbiddenError('Cannot accept follow request from a blocked user');
      }

      const request = await tx.follow_requests.findUnique({
        where: {
          requester_id_target_id: {
            requester_id: requesterId,
            target_id: ownerId
          }
        }
      });

      if (!request) {
        throw new AppError.NotFoundError('Follow request not found');
      }

      if (request.status !== 'pending') {
        throw new AppError.BadRequestError(`Request already ${request.status}`);
      }

      await tx.follow_requests.update({
        where: {
          requester_id_target_id: {
            requester_id: requesterId,
            target_id: ownerId
          }
        },
        data: { status: 'accepted' }
      });

      const follow = await tx.follows.create({
        data: {
          follower_id: requesterId,
          following_id: ownerId
        }
      });

      return { success: true, follow };
=======
    if (ownerId === requesterId) throw new AppError.BadRequestError('You cannot accept a follow request from yourself');

    return (tx || prisma).$transaction(async (tx) => {
      const request = await followRequestRepo.withTx(tx).findRequest(requesterId, ownerId);
      if (!request) throw new AppError.NotFoundError('Follow request not found');
      if (request.status !== 'pending') throw new AppError.BadRequestError(`Request already ${request.status}`);

      await followRequestRepo.withTx(tx).accept(requesterId, ownerId);

      const follow = await followRepo.follow(requesterId, ownerId);

      return follow;
>>>>>>> dev
    });
  }

  async rejectFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
<<<<<<< HEAD
    return (tx || prisma).$transaction(async (tx) => {
      const request = await tx.follow_requests.findUnique({
        where: {
          requester_id_target_id: {
            requester_id: requesterId,
            target_id: ownerId
          }
        }
      });

      if (!request) {
        throw new AppError.NotFoundError('Follow request not found');
      }

      if (request.status !== 'pending') {
        throw new AppError.BadRequestError(`Request already ${request.status}`);
      }

      const updated = await tx.follow_requests.update({
        where: {
          requester_id_target_id: {
            requester_id: requesterId,
            target_id: ownerId
          }
        },
        data: { status: 'rejected' }
      });

      return { success: true, rejected: true };
    });
  }

  async cancelFollowRequest(requesterId: string, targetId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const deleted = await tx.follow_requests.deleteMany({
        where: {
          requester_id: requesterId,
          target_id: targetId,
          status: 'pending'
        }
      });

      if (deleted.count === 0) {
        throw new AppError.NotFoundError('No pending follow request found');
      }

      return { success: true, cancelled: true };
    });
  }

  async checkIfFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.follows.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId
        }
      }
    });
    return !!follow;
  }

  async checkFollowRequestStatus(requesterId: string, targetId: string) {
    const request = await prisma.follow_requests.findUnique({
      where: {
        requester_id_target_id: {
          requester_id: requesterId,
          target_id: targetId
        }
      }
    });

    return {
      status: request?.status || null,
      pending: request?.status === 'pending'
    };
=======
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
>>>>>>> dev
  }

  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
<<<<<<< HEAD
      prisma.follows.count({ where: { following_id: userId } }),
      prisma.follows.count({ where: { follower_id: userId } })
=======
      followRepo.getFollowerCount(userId),
      followRepo.getFollowingCount(userId)
>>>>>>> dev
    ]);

    return { followersCount, followingCount };
  }
}

export const followService = new FollowService();