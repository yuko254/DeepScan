import { Prisma, type comment_likes } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class CommentLikeDao extends BaseDao<
  comment_likes,
  Prisma.comment_likesCreateInput,
  Prisma.comment_likesUpdateInput,
  Prisma.comment_likesWhereUniqueInput
> {
  constructor() {
    super(prisma.comment_likes);
  }

  async like(user_id: string, comment_id: string): Promise<comment_likes> {
    return prisma.comment_likes.create({
      data: {
        users: { connect: { user_id } },
        comments: { connect: { comment_id } },
      },
    });
  }

  async unlike(user_id: string, comment_id: string): Promise<comment_likes> {
    return prisma.comment_likes.delete({ where: { user_id_comment_id: { user_id, comment_id } } });
  }

  async isLiked(user_id: string, comment_id: string): Promise<boolean> {
    const like = await prisma.comment_likes.findUnique({
      where: { user_id_comment_id: { user_id, comment_id } },
    });
    return like !== null;
  }
}
