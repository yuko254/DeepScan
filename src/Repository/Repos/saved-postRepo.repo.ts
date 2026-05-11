import { Prisma, type saved_posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class SavedPostRepo extends BaseRepository<
  typeof prisma.saved_posts
> {
  constructor() {
    super(prisma.saved_posts, 'saved_posts', 'saved_id');
  }

  async save(user_id: string, post_id: string): Promise<saved_posts> {
    return prisma.saved_posts.create({
      data: {
        user: { connect: { user_id } },
        post: { connect: { post_id } },
      },
    });
  }

  async unsave(user_id: string, post_id: string): Promise<void> {
    await prisma.saved_posts.deleteMany({ where: { user_id, post_id } });
  }

  async isSaved(user_id: string, post_id: string): Promise<boolean> {
    const saved = await prisma.saved_posts.findFirst({ where: { user_id, post_id } });
    return saved !== null;
  }

  async getSavedByUser(user_id: string): Promise<saved_posts[]> {
    return prisma.saved_posts.findMany({
      where: { user_id },
      include: { post: true },
      orderBy: { saved_at: 'desc' },
    });
  }
}
