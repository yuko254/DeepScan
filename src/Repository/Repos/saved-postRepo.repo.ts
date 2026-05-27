import { saved_posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class SavedPostRepo extends BaseRepository<typeof prisma.saved_posts> {
  constructor() {
    super(prisma.saved_posts, 'saved_posts', 'saved_id');
  }

  private includeLite = {
    content: { include: { user: { include: { profile: true } } } },
    category: true,
    location: { include: { city: true, country: true } },
    postTags: { include: { tag: true } }
  }

  async findUserSavedPosts(user_id: string, limit: number, cursor?: Date) {
    const savedPosts = await this.model.findMany({
      where: {
        user_id,
        ...(cursor && { saved_at: { lt: cursor } })
      },
      include: { post: { include: this.includeLite } },
      orderBy: { saved_at: 'desc' },
      take: limit
    });

    const nextCursor = savedPosts.length === limit
      ? savedPosts[savedPosts.length - 1]?.saved_at
      : null;

    return { savedPosts, nextCursor };
  }

  async save(user_id: string, post_id: string) {
    return this.model.create({
      data: {
        user: { connect: { user_id } },
        post: { connect: { content_id: post_id } }
      },
    });
  }

  async unsave(user_id: string, post_id: string) {
    await this.model.delete({ where: { user_id_post_id: { user_id, post_id } } });
  }

  async isSaved(user_id: string, post_id: string) {
    const save = await this.model.findUnique({
      where: { user_id_post_id: { user_id, post_id } }
    });
    return save !== null;
  }

  async getIsSavedBatch(postIds: string[], userId: string) {
    const saves = await this.model.findMany({
      where: { post_id: { in: postIds }, user_id: userId },
      select: { post_id: true }
    });
    return new Set(saves.map(s => s.post_id));
  }

  async getSaveCount(post_id: string) {
    return this.model.count({ where: { post_id } });
  }

  async getSaveCountsBatch(postIds: string[]) {
    const counts = await this.model.groupBy({
      by: ['post_id'],
      where: { post_id: { in: postIds } },
      _count: true
    });
    return new Map(counts.map(c => [c.post_id, c._count]));
  }
}
