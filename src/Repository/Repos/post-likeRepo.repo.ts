import { Prisma, type post_likes } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostLikeRepo extends BaseRepository<
  typeof prisma.post_likes
> {
  constructor() {
    super(prisma.post_likes, 'post_likes');
  }

  async like(user_id: string, post_id: string): Promise<post_likes> {
    return prisma.post_likes.create({
      data: {
        user: { connect: { user_id } },
        post: { connect: { post_id } },
      },
    });
  }

  async unlike(user_id: string, post_id: string): Promise<post_likes> {
    return prisma.post_likes.delete({ where: { user_id_post_id: { user_id, post_id } } });
  }

  async isLiked(user_id: string, post_id: string): Promise<boolean> {
    const like = await prisma.post_likes.findUnique({
      where: { user_id_post_id: { user_id, post_id } },
    });
    return like !== null;
  }

  async getLikedPostsByUser(user_id: string): Promise<post_likes[]> {
    return prisma.post_likes.findMany({ where: { user_id } });
  }
}
