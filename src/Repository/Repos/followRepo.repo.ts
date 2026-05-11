import { Prisma, type follows } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class FollowRepo extends BaseRepository<
  typeof prisma.follows
> {
  constructor() {
    super(prisma.follows, 'follows', undefined);
  }
  async findById(): Promise<never> {
    throw new Error('BlockRepo does not support findById — use findUnique with composite key { blocker_id, blocked_id }');
  }

  async follow(follower_id: string, following_id: string): Promise<follows> {
    return prisma.follows.create({
      data: {
        follower: { connect: { user_id: follower_id } },
        following: { connect: { user_id: following_id } },
      },
    });
  }

  async unfollow(follower_id: string, following_id: string): Promise<follows> {
    return prisma.follows.delete({
      where: { follower_id_following_id: { follower_id, following_id } },
    });
  }

  async isFollowing(follower_id: string, following_id: string): Promise<boolean> {
    const follow = await prisma.follows.findUnique({
      where: { follower_id_following_id: { follower_id, following_id } },
    });
    return follow !== null;
  }

  async getFollowers(following_id: string): Promise<follows[]> {
    return prisma.follows.findMany({ where: { following_id } });
  }

  async getFollowing(follower_id: string): Promise<follows[]> {
    return prisma.follows.findMany({ where: { follower_id } });
  }

  async getFollowerCount(following_id: string): Promise<number> {
    return prisma.follows.count({ where: { following_id } });
  }

  async getFollowingCount(follower_id: string): Promise<number> {
    return prisma.follows.count({ where: { follower_id } });
  }
}
