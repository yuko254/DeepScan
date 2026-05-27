import { type comment_likes } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentLikeRepo extends BaseRepository<typeof prisma.comment_likes> {
  constructor() {
    super(prisma.comment_likes, 'comment_likes');
  }

  async like(user_id: string, comment_id: string) {
    return this.model.create({
      data: {
        user: { connect: { user_id } },
        comment: { connect: { comment_id } },
      },
    });
  }

  async unlike(user_id: string, comment_id: string) {
    return this.model.delete({ where: { user_id_comment_id: { user_id, comment_id } } });
  }

  async isLiked(user_id: string, comment_id: string) {
    const like = await this.model.findUnique({
      where: { user_id_comment_id: { user_id, comment_id } },
    });
    return like !== null;
  }

  async getLikeCount(comment_id: string) {
    return this.model.count({ where: { comment_id } });
  }

  async getLikedCommentsByUser(user_id: string) {
    return this.model.findMany({ where: { user_id } });
  }
}
