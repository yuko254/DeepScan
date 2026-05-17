import { type saved_posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class SavedPostRepo extends BaseRepository<typeof prisma.saved_posts> {
  constructor() {
    super(prisma.saved_posts, 'saved_posts', 'saved_id');
  }

  async save(user_id: string, post_id: string) {
    return this.model.create({
      data: {
        user: { connect: { user_id } },
        post: { connect: { content_id: post_id } }, // posts PK is content_id
      },
    });
  }

  async unsave(user_id: string, post_id: string) {
    await this.model.deleteMany({ where: { user_id, post_id } });
  }

  async isSaved(user_id: string, post_id: string) {
    const saved = await this.model.findFirst({ where: { user_id, post_id } });
    return saved !== null;
  }

  async getSavedByUser(user_id: string) {
    return this.model.findMany({
      where: { user_id },
      include: { post: { include: { content: { include: { media: true, user: true } } } } },
      orderBy: { saved_at: 'desc' },
    });
  }

  async countByUser(user_id: string) {
    return this.model.count({ where: { user_id } });
  }
}
