<<<<<<< HEAD
import { type follows } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
=======
import { Prisma, prisma } from '../../config/prisma.js';
>>>>>>> dev
import { BaseRepository } from './BaseRepository.repo.js';

export class FollowRepo extends BaseRepository<typeof prisma.follows> {
  constructor() {
    super(prisma.follows, 'follows', undefined);
  }

<<<<<<< HEAD
  async findById() {
=======
  override async findById(): Promise<never> {
>>>>>>> dev
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

<<<<<<< HEAD
=======
  async unfollowBoth(user_id_a: string, user_id_b: string) {
    return this.model.deleteMany({
      where: {
        OR: [
          { follower_id: user_id_a, following_id: user_id_b },
          { follower_id: user_id_b, following_id: user_id_a }
        ]
      }
    });
  }

  async findFollowingIds(follower_id: string): Promise<Set<string>> {
    const follows = await this.model.findMany({
      where: { follower_id },
      select: { following_id: true }
    });
    return new Set(follows.map(f => f.following_id));
  }

  async findFollowers(following_id: string, limit: number, cursor?: Date) {
    const where: Prisma.followsWhereInput = {
      following_id,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const follows = await this.model.findMany({
      take: limit,
      where,
      include: { follower: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = follows.length === limit
      ? follows[follows.length - 1]?.created_at
      : null;

    return { follows, nextCursor };
  }

  async findFollowing(follower_id: string, limit: number, cursor?: Date) {
    const where: Prisma.followsWhereInput = {
      follower_id,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const follows = await this.model.findMany({
      take: limit,
      where,
      include: { following: { include: { profile: true } } },
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = follows.length === limit
      ? follows[follows.length - 1]?.created_at
      : null;

    return { follows, nextCursor };
  }

>>>>>>> dev
  async isFollowing(follower_id: string, following_id: string) {
    const follow = await this.model.findUnique({
      where: { follower_id_following_id: { follower_id, following_id } },
    });
    return follow !== null;
  }

<<<<<<< HEAD
  async getFollowers(following_id: string) {
    return this.model.findMany({ where: { following_id } });
  }

  async getFollowing(follower_id: string) {
    return this.model.findMany({ where: { follower_id } });
  }

=======
>>>>>>> dev
  async getFollowerCount(following_id: string) {
    return this.model.count({ where: { following_id } });
  }

  async getFollowingCount(follower_id: string) {
    return this.model.count({ where: { follower_id } });
  }

  async getMutuals(user_id_a: string, user_id_b: string) {
    const [aFollowing, bFollowing] = await Promise.all([
<<<<<<< HEAD
      this.model.findMany({ where: { follower_id: user_id_a }, select: { following_id: true } }),
      this.model.findMany({ where: { follower_id: user_id_b }, select: { following_id: true } }),
    ]);
    const bSet = new Set(bFollowing.map((f) => f.following_id));
    return aFollowing.map((f) => f.following_id).filter((id) => bSet.has(id));
=======
      this.model.findMany({
        where: { follower_id: user_id_a },
        include: { following: { include: { profile: true } } }
      }),
      this.model.findMany({
        where: { follower_id: user_id_b },
        select: { following_id: true }
      })
    ]);

    const bSet = new Set(bFollowing.map(f => f.following_id));
    const mutuals = aFollowing.filter(f => bSet.has(f.following_id));

    return mutuals.map(m => m.following);
>>>>>>> dev
  }
}
