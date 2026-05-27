import { Prisma, prisma } from '../../config/prisma.js';
import { commentRepo, commentHashtagRepo } from '../../Repository/instances.js';
import * as interactions from "../../validations/interactions.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';

class CommentService {

  async getComment(comment_id: string) {
    const comment = await commentRepo.findByIdWithDetails(comment_id);
    if (!comment) throw new AppError.NotFoundError('Comment not found');
    return comment;
  }

  async getCommentsForPost(post_id: string, limit: number, cursor?: Date) {
    return commentRepo.findByPost(post_id, limit, cursor);
  }

  async getCommentReplies(commentId: string, limit: number, cursor?: Date) {
    const replies = await prisma.comments.findMany({
      where: {
        comment_parent_id: commentId,
        is_deleted: false,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: {
        user: {
          include: { profile: true }
        },
        _count: {
          select: {
            comment_likes: true,
            replies: true
          }
        }
      },
      orderBy: { created_at: 'asc' },
      take: limit
    });

    const nextCursor = replies.length === limit
      ? replies[replies.length - 1]?.created_at
      : null;

    return { replies, nextCursor };
  }

  async createComment(userID: string, input: interactions.CommentCreate, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Create the comment
      const comment = await commentRepo.withTx(tx).create({
        data: {
          user_id: userID,
          content: input.content,
          post_id: input.post_id,
          comment_parent_id: input.comment_parent_id ?? null,
        }
      });

      // Process hashtags and mentions with the same transaction
      await Promise.all([
        hashtagService.scanAndLinkForComment(comment.comment_id, input.content, tx),
        mentionService.scanAndNotifyForComment(userID, comment.comment_id, input.content, tx),
      ]);

      // Fetch the full comment with all relations using the same transaction
      const fullComment = await commentRepo.withTx(tx).findByIdWithDetails(comment.comment_id);
      if (!fullComment) throw new Error('Failed to retrieve created comment');

      return fullComment;
    });
  }

  async updateComment(userID: string, input: interactions.CommentUpdate, tx?: Prisma.TransactionClient) {
    if (input.content === undefined)
      return this.getComment(input.comment_id);

    const existing = await this.getComment(input.comment_id);
    if (userID !== existing.user_id) throw new AppError.ForbiddenError('You can only update comments you own');

    return await (tx || prisma).$transaction(async (tx) => {
      // Update the comment content
      await commentRepo.withTx(tx).update({
        where: { comment_id: input.comment_id },
        data: { content: input.content! },
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
          throw new AppError.NotFoundError('Comment not found');
        }
        throw e;
      });

      // Remove all existing hashtag links for this comment
      await commentHashtagRepo.withTx(tx).deleteMany({ where: { comment_id: input.comment_id } });

      // Re‑scan and link new hashtags/mentions from the updated content
      await Promise.all([
        hashtagService.scanAndLinkForComment(input.comment_id, input.content!, tx),
        mentionService.scanAndNotifyForComment(userID, input.comment_id, input.content!, tx),
      ]);

      // Return the full comment with all relations
      const fullComment = await commentRepo.withTx(tx).findByIdWithDetails(input.comment_id);
      if (!fullComment) throw new Error('Failed to retrieve updated comment');
      return fullComment;
    });
  }

  async deleteComment(comment_id: string) {
    await commentRepo.softDelete(comment_id, "user");
  }

  async isLiked(userID: string, commentId: string) {
    const like = await prisma.comment_likes.findUnique({
      where: {
        user_id_comment_id: {
          user_id: userID,
          comment_id: commentId
        }
      }
    });
    return !!like;
  }

  async getIsLikedBatch(commentIds: string[], userId: string) {
    const likes = await prisma.comment_likes.findMany({
      where: { comment_id: { in: commentIds }, user_id: userId },
      select: { comment_id: true }
    });
    const likedSet = new Set(likes.map(l => l.comment_id));
    return commentIds.map(id => likedSet.has(id));
  }

  async toggleLikeComment(userId: string, commentId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const comment = await commentRepo.withTx(tx).findUnique({
        where: { comment_id: commentId },
        select: { comment_id: true }
      });
      if (!comment) throw new AppError.NotFoundError('Comment not found');

      const existing = await tx.comment_likes.findUnique({
        where: {
          user_id_comment_id: {
            user_id: userId,
            comment_id: commentId
          }
        }
      });

      if (existing) {
        await tx.comment_likes.delete({ where: { id: existing.id } });
        return { liked: false, commentId };
      }

      await tx.comment_likes.create({
        data: {
          user_id: userId,
          comment_id: commentId
        }
      });
      return { liked: true, commentId };
    }).catch((e: any) => {
      if (e.code === 'P2003') throw new AppError.NotFoundError('Comment not found');
      throw e;
    });
  }

  async getLikeCountsBatch(commentIds: string[]) {
    const counts = await prisma.comment_likes.groupBy({
      by: ['comment_id'],
      where: { comment_id: { in: commentIds } },
      _count: true
    });
    const map = new Map(counts.map(c => [c.comment_id, c._count]));
    return commentIds.map(id => map.get(id) || 0);
  }
}

export const commentService = new CommentService()