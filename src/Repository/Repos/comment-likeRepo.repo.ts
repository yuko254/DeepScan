<<<<<<< HEAD
import { type comment_likes } from "@prisma/client";
=======
>>>>>>> dev
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentLikeRepo extends BaseRepository<typeof prisma.comment_likes> {
  constructor() {
    super(prisma.comment_likes, 'comment_likes');
  }

  async like(user_id: string, comment_id: string) {
<<<<<<< HEAD
    return this.model.create({
      data: {
        user: { connect: { user_id } },
        comment: { connect: { comment_id } },
      },
    });
=======
    return this.model.create({ data: { user_id, comment_id } });
>>>>>>> dev
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

<<<<<<< HEAD
=======
  async getIsLikedBatch(comment_ids: string[], user_id: string) {
    const likes = await this.model.findMany({
      where: { comment_id: { in: comment_ids }, user_id },
      select: { comment_id: true }
    });
    const likedSet = new Set(likes.map(l => l.comment_id));
    return comment_ids.map(id => likedSet.has(id));
  }

>>>>>>> dev
  async getLikeCount(comment_id: string) {
    return this.model.count({ where: { comment_id } });
  }

<<<<<<< HEAD
=======
  async getLikeCountsBatch(comment_ids: string[]) {
    const counts = await this.model.groupBy({
      by: ['comment_id'],
      where: { comment_id: { in: comment_ids } },
      _count: true
    });
    const map = new Map(counts.map(c => [c.comment_id, c._count]));
    return comment_ids.map(id => map.get(id) || 0);
  }

>>>>>>> dev
  async getLikedCommentsByUser(user_id: string) {
    return this.model.findMany({ where: { user_id } });
  }
}
