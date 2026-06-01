import { Prisma, prisma } from '../../config/prisma.js';
import { commentRepo, commentHashtagRepo, commentLikeRepo } from '../../Repository/instances.js';
import * as interactions from "../../validations/interactions.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { hashtagService } from '../references/hashtag.service.js';
import { mentionService } from '../references/mention.service.js';
import { notificationService } from '../notification.service.js';

class CommentService {

  async getComment(commentId: string) {
    const comment = await commentRepo.findComment(commentId);
    if (!comment) throw new AppError.NotFoundError('Comment not found');
    return comment;
  }

  async getCommentsForPost(postId: string, limit: number, cursor?: Date) {
    return commentRepo.findByPost(postId, limit, cursor);
  }

  async getCommentReplies(commentId: string, limit: number, cursor?: Date) {
    return commentRepo.findReplies(commentId, limit, cursor);
  }

  async createComment(userId: string, input: interactions.CommentCreate, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const comment = await commentRepo.withTx(tx).create({
        data: {
          user_id: userId,
          content: input.content,
          post_id: input.post_id,
          comment_parent_id: input.comment_parent_id ?? null,
        },
        include: {
          post: { include: { content: true } },
          comment_parent: { include: { user: true } }
        }
      });

      // Prepare notification (using included data, no extra query)
      let notificationPromise: Promise<any> = Promise.resolve();

      if (input.comment_parent_id) {
        if (comment.comment_parent?.user_id && comment.comment_parent.user_id !== userId) {
          notificationPromise = notificationService.sendForComment(
            { user_id: comment.comment_parent.user_id, actor_id: userId, type: 'reply', message: `replied to your comment` },
            input.comment_parent_id,
            tx
          );
        }
      } else {
        if (comment.post?.content.user_id && comment.post.content.user_id !== userId) {
          notificationPromise = notificationService.sendForPost(
            { user_id: comment.post.content.user_id, actor_id: userId, type: 'comment', message: `commented on your post` },
            input.post_id,
            tx
          );
        }
      }

      await Promise.all([
        hashtagService.scanAndLinkForComment(comment.comment_id, input.content, tx),
        mentionService.scanAndNotifyForComment(userId, comment.comment_id, input.content, tx),
        notificationPromise
      ]);

      return commentRepo.withTx(tx).findComment(comment.comment_id);
    });
  }

  async updateComment(userId: string, input: interactions.CommentUpdate, tx?: Prisma.TransactionClient) {
    if (input.content === undefined) return this.getComment(input.comment_id);

    return (tx || prisma).$transaction(async (tx) => {
      await commentRepo.withTx(tx).update({
        where: { comment_id: input.comment_id },
        data: { content: input.content! },
      }).catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('Comment not found');
        }
        throw e;
      });

      await commentHashtagRepo.withTx(tx).deleteMany({ where: { comment_id: input.comment_id } });

      await Promise.all([
        hashtagService.scanAndLinkForComment(input.comment_id, input.content!, tx),
        mentionService.scanAndNotifyForComment(userId, input.comment_id, input.content!, tx),
      ]);

      const fullComment = await commentRepo.withTx(tx).findComment(input.comment_id);
      if (!fullComment) throw new AppError.NotFoundError('Failed to retrieve updated comment');
      return fullComment;
    });
  }

  async deleteComment(commentId: string) {
    return commentRepo.softDelete(commentId, "user");
  }

  async isLiked(userId: string, commentId: string) {
    return commentLikeRepo.isLiked(userId, commentId);
  }

  async getIsLikedBatch(commentIds: string[], userId: string) {
    return commentLikeRepo.getIsLikedBatch(commentIds, userId);
  }

  async toggleLikeComment(userId: string, commentId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      try {
        const like = await commentLikeRepo.withTx(tx).like(userId, commentId);

        const comment = like.comment;
        if (comment.user_id && comment.user_id !== userId) {
          await notificationService.sendForComment(
            {
              user_id: comment.user_id,
              actor_id: userId,
              type: 'like',
              message: `liked your comment`
            },
            commentId,
            tx
          );
        }

        return { liked: true };
      } catch (e: any) {
        if (e.code === 'P2002') {
          await commentLikeRepo.withTx(tx).unlike(userId, commentId);
          return { liked: false };
        }
        throw e;
      }
    }).catch((e: any) => {
      if (e.code === 'P2003') throw new AppError.NotFoundError('Comment not found');
      throw e;
    });
  }

  async getLikeCountsBatch(commentIds: string[]) {
    return commentLikeRepo.getLikeCountsBatch(commentIds);
  }
}

export const commentService = new CommentService()