import { type comments } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentRepo extends BaseRepository<typeof prisma.comments> {
  constructor() {
    super(prisma.comments, 'comments', 'comment_id');
  }

  async findByPost(post_id: string): Promise<comments[]> {
    return prisma.comments.findMany({
      where: { post_id, comment_parent_id: null, is_deleted: false }, // fix: was parent_id
      orderBy: { created_at: 'asc' },
    });
  }

  async findReplies(comment_parent_id: string): Promise<comments[]> {
    return prisma.comments.findMany({
      where: { comment_parent_id, is_deleted: false },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByUser(user_id: string): Promise<comments[]> {
    return prisma.comments.findMany({
      where: { user_id, is_deleted: false },
      orderBy: { created_at: 'desc' },
    });
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

  async getCommentCount(post_id: string): Promise<number> {
    return prisma.comments.count({ where: { post_id, is_deleted: false } });
  }

  /** Soft delete — sets is_deleted = true */
  async softDelete(comment_id: string): Promise<comments> {
    return prisma.comments.update({ where: { comment_id }, data: { is_deleted: true } });
  }
}
