import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentRepo extends BaseRepository<typeof prisma.comments> {
  constructor() {
    super(prisma.comments, 'comments', 'comment_id');
  }

  private includeDetails = {
    user: { include: { profile: true } },
    post: { include: { content: true } },
  }

  async findComment(comment_id: string) {
    return this.model.findUnique({
      where: { comment_id },
      include: this.includeDetails
    });
  }

  async findByPost(post_id: string, limit: number, cursor?: Date) {
    const comments = await this.model.findMany({
      where: {
        post_id,
        comment_parent_id: null,
        is_deleted: false,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: this.includeDetails,
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = comments.length === limit
      ? comments[comments.length - 1]?.created_at
      : null;

    return { comments, nextCursor };
  }

  async findReplies(comment_parent_id: string, limit: number, cursor?: Date) {
    const replies = await this.model.findMany({
      where: {
        comment_parent_id,
        is_deleted: false,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: this.includeDetails,
      orderBy: { created_at: 'asc' },
      take: limit
    });

    const nextCursor = replies.length === limit
      ? replies[replies.length - 1]?.created_at
      : null;

    return { replies, nextCursor };
  }

  async findByUser(user_id: string) {
    return this.model.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
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
    const map = new Map(counts.map(c => [c.post_id, c._count]));
    return postIds.map(id => map.get(id) || 0);
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
