import { Prisma, type saved_posts } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class SavedPostDao extends BaseDao<
  saved_posts,
  Prisma.saved_postsCreateInput,
  Prisma.saved_postsUpdateInput,
  Prisma.saved_postsWhereUniqueInput
> {
  constructor() {
    super(prisma.saved_posts);
  }

  async save(user_id: string, post_id: string): Promise<saved_posts> {
    return prisma.saved_posts.create({
      data: {
        users: { connect: { user_id } },
        posts: { connect: { post_id } },
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
      include: { posts: true },
      orderBy: { saved_at: 'desc' },
    });
  }
}
