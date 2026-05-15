import { type posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostRepo extends BaseRepository<typeof prisma.posts> {
  constructor() {
    super(prisma.posts, 'posts', 'content_id'); // fix: PK is content_id
  }

  async findByUser(user_id: string): Promise<posts[]> {
    // posts go through contents for user_id
    return prisma.posts.findMany({
      where: { content: { user_id } },
      include: { content: true },
      orderBy: { content: { created_at: 'desc' } },
    });
  }

  async findByCategory(category_id: bigint): Promise<posts[]> {
    return prisma.posts.findMany({
      where: { category_id },
      include: { content: true },
      orderBy: { content: { created_at: 'desc' } },
    });
  }

  async findWithMedia(content_id: string): Promise<posts | null> {
    return prisma.posts.findUnique({
      where: { content_id },
      include: {
        content: { include: { media: true } },
        post_blocks: { orderBy: { position: 'asc' }, include: { media: true } },
      },
    });
  }

  async findWithDetails(content_id: string): Promise<posts | null> {
    return prisma.posts.findUnique({
      where: { content_id },
      include: {
        content: {
          include: {
            media: true,
            contentHashtags: { include: { hashtag: true } },
            user: { include: { profile: true } },
          },
        },
        post_blocks: { orderBy: { position: 'asc' }, include: { media: true } },
        post_likes: true,
        comments: { where: { comment_parent_id: null, is_deleted: false } },
        location: { include: { city: true, country: true } },
        category: true,
        postTags: { include: { tag: true } },
      },
    });
  }

  async getLikeCount(content_id: string): Promise<number> {
    return prisma.post_likes.count({ where: { post_id: content_id } });
  }

  async getCommentCount(content_id: string): Promise<number> {
    return prisma.comments.count({ where: { post_id: content_id, is_deleted: false } });
  }
}
