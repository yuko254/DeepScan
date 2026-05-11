import { Prisma, type posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostRepo extends BaseRepository<
  typeof prisma.posts
> {
  constructor() {
    super(prisma.posts, 'posts', 'post_id');
  }

  async findByUser(user_id: string): Promise<posts[]> {
    return prisma.posts.findMany({ where: { user_id }, orderBy: { created_at: 'desc' } });
  }

  async findByCategory(category_id: bigint): Promise<posts[]> {
    return prisma.posts.findMany({ where: { category_id }, orderBy: { created_at: 'desc' } });
  }

  async findWithMedia(post_id: string): Promise<posts | null> {
    return prisma.posts.findUnique({
      where: { post_id },
      include: { media: true, post_blocks: { orderBy: { position: 'asc' } } },
    });
  }

  async findWithDetails(post_id: string): Promise<posts | null> {
    return prisma.posts.findUnique({
      where: { post_id },
      include: {
        media: true,
        post_blocks: { orderBy: { position: 'asc' } },
        post_hashtags: { include: { hashtag: true } },
        post_likes: true,
        comments: true,
        users: { include: { profiles: true } },
        locations: true,
        categories: true,
      },
    });
  }

  async getLikeCount(post_id: string): Promise<number> {
    return prisma.post_likes.count({ where: { post_id } });
  }
}
