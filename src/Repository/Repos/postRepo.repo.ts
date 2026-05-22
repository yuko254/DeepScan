import { type posts } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostRepo extends BaseRepository<typeof prisma.posts> {
  constructor() {
    super(prisma.posts, 'posts', 'content_id');
  }

  async findByCategory(category_id: number) {
    return this.model.findMany({
      where: { category_id },
      include: { content: true },
      orderBy: { content: { created_at: 'desc' } },
    });
  }

  async findPost(content_id: string) {
    return this.model.findUnique({
      where: { content_id },
      include: {
        content: { include: { user: { include: { profile: true } }}},
        location: { include: { city: true, country: true } },
        category: true,
        postTags: { include: { tag: true } },
        _count: {
          select: {
            comments: { where: { comment_parent_id: null } },
            post_likes: true,
          },
        },
      },
    });
  }

  async getUserPostsPage(user_id: string, take: number, skip: number) {
    return this.model.findMany({
      take,
      skip,
      where: { content: { user_id } },
      include: { content: true },
      orderBy: { content: { created_at: 'desc' } },
    });
  }

  async getLikeCount(post_id: string) {
    const view = await prisma.post_like_counts.findUnique({ where: { post_id } });
    return view?.likes_count ? Number(view.likes_count) : 0;
  }

  async getCommentCount(post_id: string) {
    return prisma.comments.count({
      where: { post_id, is_deleted: false },
    });
  }

  async countByUser(user_id: string) {
    return this.model.count({ where: { content: { user_id } } });
  }
}
