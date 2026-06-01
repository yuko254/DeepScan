import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostLikeRepo extends BaseRepository<typeof prisma.post_likes> {
  constructor() {
    super(prisma.post_likes, 'post_likes');
  }

  async like(user_id: string, post_id: string) {
    return this.model.create({ data: { user_id, post_id }, include: { post: { include: { content: true } } } });
  }

  async unlike(user_id: string, post_id: string) {
    return this.model.delete({ where: { user_id_post_id: { user_id, post_id } } });
  }

  async isLiked(user_id: string, post_id: string) {
    const like = await this.model.findUnique({
      where: { user_id_post_id: { user_id, post_id } },
    });
    return like !== null;
  }

  async getIsLikedBatch(postIds: string[], userId: string): Promise<boolean[]> {
    const likes = await this.model.findMany({
      where: { post_id: { in: postIds }, user_id: userId },
      select: { post_id: true }
    });
    const likedSet = new Set(likes.map(l => l.post_id));
    return postIds.map(id => likedSet.has(id));
  }

  async getLikeCount(post_id: string) {
    return this.model.count({ where: { post_id } });
  }

  async getLikeCountsBatch(postIds: string[]) {
    const counts = await this.model.groupBy({
      by: ['post_id'],
      where: { post_id: { in: postIds } },
      _count: true
    });
    const map = new Map(counts.map(c => [c.post_id, c._count]));
    return postIds.map(id => map.get(id) || 0);
  }

  async getLikedPostsByUser(user_id: string) {
    return this.model.findMany({ where: { user_id } });
  }
}
