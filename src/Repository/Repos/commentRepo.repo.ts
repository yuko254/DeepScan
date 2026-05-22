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
          mentionTargets: {
            include: {
              mentions: {
                include: { user: true },
                orderBy: { created_at: 'desc' },
              },
            },
          },
          commentHashtags: {
            include: { hashtag: true },
            orderBy: { created_at: 'asc' },
          },
        },
      }),
      this.getLikeCount(comment_id),
    ]);

    if (!comment) return null;
    return { ...comment, likes: likeCount };
  }

  async findByPost(post_id: string) {
    return this.model.findMany({
      where: { post_id, comment_parent_id: null },
      orderBy: { created_at: 'asc' },
    });
  }

  async findByPostCursor(post_id: string, cursor?: string, limit: number = 20) {
    const cursorCondition = cursor
      ? { created_at: { lt: new Date(cursor) } }
      : {};
    const comments = await this.model.findMany({
      where: { post_id, comment_parent_id: null, ...cursorCondition },
      orderBy: { created_at: 'desc' },
      take: limit + 1,
      include: {
        user: { include: { profile: true } },
        replies: {
          orderBy: { created_at: 'asc' },
          include: { user: { include: { profile: true } } },
        },
      },
    });
    let nextCursor = null;
    let pageComments = comments;
    if (comments.length > limit) {
      const last = comments[limit]!;
      nextCursor = last.created_at.toISOString();
      pageComments = comments.slice(0, limit);
    }
    // Attach likeCount for each comment (including replies)
    const withLikes = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        likes: await this.getLikeCount(comment.comment_id),
        replies: await Promise.all(
          comment.replies.map(async (reply) => ({
            ...reply,
            likes: await this.getLikeCount(reply.comment_id),
          }))
        ),
      }))
    );
    return { comments: withLikes, nextCursor };
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
