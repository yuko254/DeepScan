import { Prisma, type follows } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class FollowDao extends BaseDao<
  follows,
  Prisma.followsCreateInput,
  Prisma.followsUpdateInput,
  Prisma.followsWhereUniqueInput
> {
  constructor() {
    super(prisma.follows);
  }

  async follow(follower_id: string, following_id: string): Promise<follows> {
    return prisma.follows.create({
      data: {
        users_follows_follower_id: { connect: { user_id: follower_id } },
        users_follows_following_id: { connect: { user_id: following_id } },
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
