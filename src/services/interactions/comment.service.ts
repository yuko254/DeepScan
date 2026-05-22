import { Prisma, prisma } from '../../config/prisma.js';
import type { CommentsCreateInput, CommentsUpdateInput } from '../../graphql/graphql.js';
import { commentRepo, commentHashtagRepo, mentionRepo } from '../../Repository/instances.js';
import * as AppError from '../../types/appErrors.types.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';

export class CommentService {

  async getComment(comment_id: string) {
    const comment = await commentRepo.findByIdWithDetails(comment_id);
    if (!comment) throw new AppError.NotFoundError('Comment not found');
    return comment;
  }

  async getCommentsForPostCursor(post_id: string, cursor?: string, limit: number = 20) {
    return commentRepo.findByPostCursor(post_id, cursor, limit);
  }

  async getCommentReplies(commentId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const replies = await prisma.comments.findMany({
      where: {
        comment_parent_id: commentId,
        is_deleted: false
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
      skip,
      take: limit,
      orderBy: { created_at: 'asc' }
    });

    const total = await prisma.comments.count({
      where: {
        comment_parent_id: commentId,
        is_deleted: false
      }
    });

    return { replies, total };
  }

  async createComment(userID: string, input: CommentsCreateInput, tx?: Prisma.TransactionClient) {
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
        mentionService.scanAndLinkForComment(comment.comment_id, input.content, tx),
      ]);

      // Fetch the full comment with all relations using the same transaction
      const fullComment = await commentRepo.withTx(tx).findByIdWithDetails(comment.comment_id);
      if (!fullComment) throw new Error('Failed to retrieve created comment');

      return fullComment;
    });
  }

  async updateComment(userID: string, input: CommentsUpdateInput, tx?: Prisma.TransactionClient) {
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

      // Remove all existing hashtag and mention links for this comment
      await commentHashtagRepo.withTx(tx).deleteMany({ where: { comment_id: input.comment_id } });
      await mentionRepo.withTx(tx).deleteMany({ where: { mention_target: { comment_id: input.comment_id } } });

      // Re‑scan and link new hashtags/mentions from the updated content
      await Promise.all([
        hashtagService.scanAndLinkForComment(input.comment_id, input.content!, tx),
        mentionService.scanAndLinkForComment(input.comment_id, input.content!, tx),
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

  async isLiked(userID: string, commentId: string): Promise<boolean> {
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

  async likeUnlikeComment(userID: string, commentId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Check if comment exists
      const comment = await commentRepo.withTx(tx).findUnique({
        where: { comment_id: commentId }
      });
      if (!comment) throw new AppError.NotFoundError('Comment not found');

      // Check if already liked
      const existing = await tx.comment_likes.findUnique({
        where: {
          user_id_comment_id: {
            user_id: userID,
            comment_id: commentId
          }
        }
      });

      let liked: boolean;
      if (existing) {
        await tx.comment_likes.delete({ where: { id: existing.id } });
        liked = false;
      } else {
        await tx.comment_likes.create({
          data: {
            user_id: userID,
            comment_id: commentId
          }
        });
        liked = true;
      }

      return { liked, commentId };
    });
  }
}

export const commentService = new CommentService()