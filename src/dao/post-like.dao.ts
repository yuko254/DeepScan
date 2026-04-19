import { Prisma, type post_likes } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class PostLikeDao extends BaseDao<
  post_likes,
  Prisma.post_likesCreateInput,
  Prisma.post_likesUpdateInput,
  Prisma.post_likesWhereUniqueInput
> {
  constructor() {
    super(prisma.post_likes);
  }

  async like(user_id: string, post_id: string): Promise<post_likes> {
    return prisma.post_likes.create({
      data: {
        users: { connect: { user_id } },
        posts: { connect: { post_id } },
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
