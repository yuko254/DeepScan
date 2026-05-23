import type { GraphqlContext } from '../../dtos/dto.js';
import { postService } from '../../services/content/post.service.js';
import { commentService } from '../../services/interactions/comment.service.js';
import { followService } from '../../services/interactions/follow.service.js';
import { blockService } from '../../services/interactions/block.service.js';
import { notificationService } from '../../services/notification.service.js';
import * as AppError from '../../types/appErrors.types.js';
import {
  LikePostSchema,
  UnlikePostSchema,
  SavePostSchema,
  UnsavePostSchema,
  LikeCommentSchema,
  UnlikeCommentSchema,
  FollowUserSchema,
  UnfollowUserSchema,
  AcceptFollowRequestSchema,
  RejectFollowRequestSchema,
  CancelFollowRequestSchema,
  BlockUserSchema,
  UnblockUserSchema,
  MarkNotificationReadSchema,
  MarkAllNotificationsReadSchema
} from '../../validations/interaction.validation.js';

export const interactionResolver = {
  Mutation: {
    likePost: async (_: any, { postId }: { postId: string }, context: GraphqlContext) => {
      const validated = LikePostSchema.parse({ postId });
      const result = await postService.likeUnlikePost(context.user!.user_id, validated.postId);
      return { liked: result.liked, postId: validated.postId, likesCount: result.likesCount };
    },

    unlikePost: async (_: any, { postId }: { postId: string }, context: GraphqlContext) => {
      const validated = UnlikePostSchema.parse({ postId });
      const result = await postService.likeUnlikePost(context.user!.user_id, validated.postId);
      return result.liked;
    },

    savePost: async (_: any, { postId }: { postId: string }, context: GraphqlContext) => {
      const validated = SavePostSchema.parse({ postId });
      await postService.saveUnsavePost(context.user!.user_id, validated.postId);
      return { saved: true, postId: validated.postId };
    },

    unsavePost: async (_: any, { postId }: { postId: string }, context: GraphqlContext) => {
      const validated = UnsavePostSchema.parse({ postId });
      const result = await postService.unsavePost(context.user!.user_id, validated.postId);
      return result;
    },

    likeComment: async (_: any, { commentId }: { commentId: string }, context: GraphqlContext) => {
      const validated = LikeCommentSchema.parse({ commentId });
      const result = await commentService.likeUnlikeComment(context.user!.user_id, validated.commentId);
      return { liked: true, commentId: validated.commentId, likesCount: result.likesCount };
    },

    unlikeComment: async (_: any, { commentId }: { commentId: string }, context: GraphqlContext) => {
      const validated = UnlikeCommentSchema.parse({ commentId });
      const result = await commentService.unlikeComment(context.user!.user_id, validated.commentId);
      return result;
    },

    followUser: async (_: any, { userId }: { userId: string }, context: GraphqlContext) => {
      const validated = FollowUserSchema.parse({ userId });
      const result = await followService.followUser(context.user!.user_id, validated.userId);
      return { success: true, status: result.status };
    },

    unfollowUser: async (_: any, { userId }: { userId: string }, context: GraphqlContext) => {
      const validated = UnfollowUserSchema.parse({ userId });
      await followService.unfollowUser(context.user!.user_id, validated.userId);
      return true;
    },

    acceptFollowRequest: async (_: any, { requesterId }: { requesterId: string }, context: GraphqlContext) => {
      const validated = AcceptFollowRequestSchema.parse({ requesterId });
      const result = await followService.acceptFollowRequest(context.user!.user_id, validated.requesterId);
      return { success: true, follow: result.follow };
    },

    rejectFollowRequest: async (_: any, { requesterId }: { requesterId: string }, context: GraphqlContext) => {
      const validated = RejectFollowRequestSchema.parse({ requesterId });
      await followService.rejectFollowRequest(context.user!.user_id, validated.requesterId);
      return true;
    },

    cancelFollowRequest: async (_: any, { userId }: { userId: string }, context: GraphqlContext) => {
      const validated = CancelFollowRequestSchema.parse({ userId });
      await followService.cancelFollowRequest(context.user!.user_id, validated.userId);
      return true;
    },

    blockUser: async (_: any, { userId }: { userId: string }, context: GraphqlContext) => {
      const validated = BlockUserSchema.parse({ userId });
      const result = await blockService.blockUser(context.user!.user_id, validated.userId);
      return { success: true, blocked: result.blocked };
    },

    unblockUser: async (_: any, { userId }: { userId: string }, context: GraphqlContext) => {
      const validated = UnblockUserSchema.parse({ userId });
      await blockService.unblockUser(context.user!.user_id, validated.userId);
      return true;
    },

    markNotificationRead: async (_: any, { notificationId }: { notificationId: string }, context: GraphqlContext) => {
      const validated = MarkNotificationReadSchema.parse({ notificationId });
      await notificationService.markAsRead(validated.notificationId, context.user!.user_id);
      return true;
    },

    markAllNotificationsRead: async (_: any, __: any, context: GraphqlContext) => {
      const validated = MarkAllNotificationsReadSchema.parse({});
      await notificationService.markAllAsRead(context.user!.user_id);
      return true;
    }
  }
};