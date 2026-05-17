import { type comments } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentRepo extends BaseRepository<typeof prisma.comments> {
  constructor() {
    super(prisma.comments, 'comments', 'comment_id');
  }

  async findByPost(post_id: string) {
    return this.model.findMany({
      where: { post_id, comment_parent_id: null, is_deleted: false }, // fix: was parent_id
      orderBy: { created_at: 'asc' },
    });
  }

  async findReplies(comment_parent_id: string) {
    return this.model.findMany({
      where: { comment_parent_id, is_deleted: false },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByUser(user_id: string) {
    return this.model.findMany({
      where: { user_id, is_deleted: false },
      orderBy: { created_at: 'desc' },
    });
  }

  async findWithLikes(comment_id: string) {
    return this.model.findUnique({
      where: { comment_id },
      include: { comment_likes: true },
    });
  }

  async getLikeCount(comment_id: string) {
    return this.model.count({ where: { comment_id } });
  }

  async getCommentCount(post_id: string) {
    return this.model.count({ where: { post_id, is_deleted: false } });
  }

  /** Soft delete — sets is_deleted = true */
  async softDelete(comment_id: string) {
    return this.model.update({ where: { comment_id }, data: { is_deleted: true } });
  }
}
