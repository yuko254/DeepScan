import { Prisma, prisma } from '../../config/prisma.js';
import * as AppError from '../../types/appErrors.types.js';

export class FollowService {

  async followUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Check if trying to follow yourself
      if (followerId === followingId) {
        throw new AppError.BadRequestError('You cannot follow yourself');
      }

      // Check if user exists
      const targetUser = await tx.users.findUnique({
        where: { user_id: followingId },
        include: { profile: true }
      });
      if (!targetUser) throw new AppError.NotFoundError('User not found');

      // Check if already following
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

      // Check if account is private
      const isPrivate = targetUser.profile?.is_private || false;

      if (isPrivate) {
        // Send follow request instead
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
        // Direct follow
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
    });
  }

  async unfollowUser(followerId: string, followingId: string, tx?: Prisma.TransactionClient) {
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
    });
  }

  async acceptFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Check if request exists
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

      // Update request status
      await tx.follow_requests.update({
        where: {
          requester_id_target_id: {
            requester_id: requesterId,
            target_id: ownerId
          }
        },
        data: { status: 'accepted' }
      });

      // Create the follow relationship
      const follow = await tx.follows.create({
        data: {
          follower_id: requesterId,
          following_id: ownerId
        }
      });

      return { success: true, follow };
    });
  }

  async rejectFollowRequest(ownerId: string, requesterId: string, tx?: Prisma.TransactionClient) {
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

  async getFollowers(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const followers = await prisma.follows.findMany({
      where: { following_id: userId },
      include: {
        follower: {
          include: { profile: true }
        }
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.follows.count({
      where: { following_id: userId }
    });

    return { followers, total };
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const following = await prisma.follows.findMany({
      where: { follower_id: userId },
      include: {
        following: {
          include: { profile: true }
        }
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.follows.count({
      where: { follower_id: userId }
    });

    return { following, total };
  }

  async getPendingFollowRequests(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const requests = await prisma.follow_requests.findMany({
      where: {
        target_id: userId,
        status: 'pending'
      },
      include: {
        requester: {
          include: { profile: true }
        }
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.follow_requests.count({
      where: {
        target_id: userId,
        status: 'pending'
      }
    });

    return { requests, total };
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
  }

  async getFollowCounts(userId: string) {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follows.count({ where: { following_id: userId } }),
      prisma.follows.count({ where: { follower_id: userId } })
    ]);

    return { followersCount, followingCount };
  }
}

export const followService = new FollowService();