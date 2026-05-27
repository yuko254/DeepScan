import { type comments } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentRepo extends BaseRepository<typeof prisma.comments> {
  constructor() {
    super(prisma.comments, 'comments', 'comment_id');
  }

  async findByIdWithDetails(comment_id: string) {
    const [comment, likeCount] = await Promise.all([
      this.model.findUnique({
        where: { comment_id },
        include: {
          user: { include: { profile: true } },
          post: { include: { content: true } },
          comment: true,
          replies: {
            orderBy: { created_at: 'asc' },
            include: { user: { include: { profile: true } } },
          },
        },
      }),
      this.getLikeCount(comment_id),
    ]);

    if (!comment) return null;
    return { ...comment, likes: likeCount };
  }

  async findByPost(post_id: string, limit: number, cursor?: Date) {
    const comments = await this.model.findMany({
      where: {
        post_id,
        comment_parent_id: null,
        is_deleted: false,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: {
        user: { include: { profile: true } },
        _count: { select: { comment_likes: true, replies: true } }
      },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = comments.length === limit
      ? comments[comments.length - 1]?.created_at
      : null;

    return { comments, nextCursor };
  }

  async findReplies(comment_parent_id: string) {
    return this.model.findMany({
      where: { comment_parent_id },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByUser(user_id: string) {
    return this.model.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findWithLikes(comment_id: string) {
    const [comment, likes] = await Promise.all([
      this.model.findUnique({ where: { comment_id } }),
      this.getLikeCount(comment_id),
    ]);
    if (!comment) return null;
    return { ...comment, likes };
  }

  async getLikeCount(comment_id: string) {
    const view = await prisma.comment_like_counts.findUnique({ where: { comment_id } });
    return view?.likes_count ? Number(view.likes_count) : 0;
  }

  async getCommentCountForPost(post_id: string) {
    return this.model.count({ where: { post_id } });
  }

  async getCommentCountsForPostBatch(postIds: string[]) {
    const counts = await this.model.groupBy({
      by: ['post_id'],
      where: { post_id: { in: postIds }, is_deleted: false },
      _count: true
    });
    return new Map(counts.map(c => [c.post_id, c._count]));
  }

  async softDelete(comment_id: string, deletor: string) {
    return this.model.update({
      where: { comment_id },
      data: {
        is_deleted: true,
        content: `deleted by ${deletor}`
      }
    });
  }
}
