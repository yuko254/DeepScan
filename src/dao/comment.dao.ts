import { Prisma, type comments } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class CommentDao extends BaseDao<
  comments,
  Prisma.commentsCreateInput,
  Prisma.commentsUpdateInput,
  Prisma.commentsWhereUniqueInput
> {
  constructor() {
    super(prisma.comments);
  }

  async findByPost(post_id: string): Promise<comments[]> {
    return prisma.comments.findMany({
      where: { post_id, parent_id: null },
      orderBy: { created_at: 'asc' },
    });
  }

  async findReplies(parent_id: string): Promise<comments[]> {
    return prisma.comments.findMany({
      where: { parent_id },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByUser(user_id: string): Promise<comments[]> {
    return prisma.comments.findMany({ where: { user_id }, orderBy: { created_at: 'desc' } });
  }

  async findWithLikes(comment_id: string): Promise<comments | null> {
    return prisma.comments.findUnique({
      where: { comment_id },
      include: { comment_likes: true },
    });
  }

  async getLikeCount(comment_id: string): Promise<number> {
    return prisma.comment_likes.count({ where: { comment_id } });
  }
}
