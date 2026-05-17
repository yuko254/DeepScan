import { type follows } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class FollowRepo extends BaseRepository<typeof prisma.follows> {
  constructor() {
    super(prisma.follows, 'follows', undefined);
  }

  async findById() {
    throw new Error('FollowRepo does not support findById — use findUnique with composite key { follower_id, following_id }');
  }

  async follow(follower_id: string, following_id: string) {
    return this.model.create({
      data: {
        follower: { connect: { user_id: follower_id } },
        following: { connect: { user_id: following_id } },
      },
    });
  }

  async unfollow(follower_id: string, following_id: string) {
    return this.model.delete({
      where: { follower_id_following_id: { follower_id, following_id } },
    });
  }

  async isFollowing(follower_id: string, following_id: string) {
    const follow = await this.model.findUnique({
      where: { follower_id_following_id: { follower_id, following_id } },
    });
    return follow !== null;
  }

  async getFollowers(following_id: string) {
    return this.model.findMany({ where: { following_id } });
  }

  async getFollowing(follower_id: string) {
    return this.model.findMany({ where: { follower_id } });
  }

  async getFollowerCount(following_id: string) {
    return this.model.count({ where: { following_id } });
  }

  async getFollowingCount(follower_id: string) {
    return this.model.count({ where: { follower_id } });
  }

  async getMutuals(user_id_a: string, user_id_b: string) {
    const [aFollowing, bFollowing] = await Promise.all([
      this.model.findMany({ where: { follower_id: user_id_a }, select: { following_id: true } }),
      this.model.findMany({ where: { follower_id: user_id_b }, select: { following_id: true } }),
    ]);
    const bSet = new Set(bFollowing.map((f) => f.following_id));
    return aFollowing.map((f) => f.following_id).filter((id) => bSet.has(id));
  }
}
