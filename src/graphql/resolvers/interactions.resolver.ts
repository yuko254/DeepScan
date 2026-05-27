// src/graphql/resolvers/interactions.resolver.ts
import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { commentService } from '../../services/interactions/comment.service.js';
import { reportService } from '../../services/interactions/report.service.js';
import { followService } from '../../services/interactions/follow.service.js';
import { blockService } from '../../services/interactions/block.service.js';
import * as interactionsSchema from '../../validations/interactions.schema.js';
import * as userSchema from '../../validations/user.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';

export const interactionsResolver: Resolvers = {
  Query: {
    // Comment queries
    comment: async (_, args) => {
      const { comment_id } = interactionsSchema.CommentIdParamSchema.parse({ comment_id: args.id });
      const comment = await commentService.getComment(comment_id);
      return comment as any;
    },

    postComments: async (_, args) => {
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await commentService.getCommentsForPost(args.postId, input.limit, input.cursor);
      return { comments: result.comments as any, nextCursor: result.nextCursor };
    },

    commentReplies: async (_, args) => {
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await commentService.getCommentReplies(args.commentId, input.limit, input.cursor);
      return { comments: result.replies as any, nextCursor: result.nextCursor };
    },

    // Report queries
    report: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { report_id } = interactionsSchema.ReportIdParamSchema.parse({ report_id: args.id });
      const report = await reportService.getReport(context.user.user_id, report_id);
      return report as any;
    },

    myReports: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await reportService.getUserReports(context.user.user_id, input.limit, input.cursor);
      return { reports: result.reports as any, nextCursor: result.nextCursor };
    },

    // Follow queries
    followers: async (_, args) => {
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await followService.getFollowers(user_id, input.limit, input.cursor);
      return { users: result.users as any, nextCursor: result.nextCursor };
    },

    following: async (_, args) => {
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await followService.getFollowing(user_id, input.limit, input.cursor);
      return { users: result.users as any, nextCursor: result.nextCursor };
    },

    myFollowRequests: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await followService.getMyFollowRequests(context.user.user_id, input.limit, input.cursor);
      return { requests: result.requests as any, nextCursor: result.nextCursor };
    },

    followRequestStatus: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const status = await followService.getFollowRequestStatus(context.user.user_id, user_id);
      return status as any;
    },

    // Block queries
    blockedUsers: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const result = await blockService.getBlockedUsers(context.user.user_id, input.limit, input.cursor);
      return { users: result.users as any, nextCursor: result.nextCursor };
    }
  },

  Mutation: {
    // Comment mutations
    createComment: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = interactionsSchema.CommentCreateSchema.parse(args.data);
      const comment = await commentService.createComment(context.user.user_id, input);
      return comment as any;
    },

    updateComment: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = interactionsSchema.CommentUpdateSchema.parse(args.data);
      const comment = await commentService.updateComment(context.user.user_id, input);
      return comment as any;
    },

    deleteComment: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { comment_id } = interactionsSchema.CommentIdParamSchema.parse({ comment_id: args.commentId });
      await commentService.deleteComment(comment_id);
      return true;
    },

    toggleLikeComment: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { comment_id } = interactionsSchema.CommentIdParamSchema.parse({ comment_id: args.commentId });
      const result = await commentService.toggleLikeComment(context.user.user_id, comment_id);
      return result.liked;
    },

    // Report mutations
    createReport: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = interactionsSchema.ReportCreateSchema.parse(args.data);
      const { type, ...data } = args.data;
      const report = await reportService.createReport(context.user.user_id, type, input);
      return report as any;
    },

    deleteReport: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { report_id } = interactionsSchema.ReportIdParamSchema.parse({ report_id: args.reportId });
      await reportService.deleteReport(report_id);
      return true;
    },

    // Follow mutations
    followUser: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const result = await followService.followUser(context.user.user_id, user_id);
      return result as any;
    },

    unfollowUser: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      await followService.unfollowUser(context.user.user_id, user_id);
      return true;
    },

    acceptFollowRequest: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.requesterId });
      const result = await followService.acceptFollowRequest(context.user.user_id, user_id);
      return result.success;
    },

    rejectFollowRequest: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.requesterId });
      const result = await followService.rejectFollowRequest(context.user.user_id, user_id);
      return result.success;
    },

    cancelFollowRequest: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      await followService.cancelFollowRequest(context.user.user_id, user_id);
      return true;
    },

    // Block mutations
    blockUser: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const result = await blockService.blockUser(context.user.user_id, user_id);
      return result.success;
    },

    unblockUser: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { user_id } = userSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const result = await blockService.unblockUser(context.user.user_id, user_id);
      return result.success;
    }
  },

  // Type resolvers for computed fields
  comments: {
    isMine: (parent, _, context: GraphqlContext) => parent.user.user_id === context.user?.user_id,
    isLiked: async (parent, _, context: GraphqlContext) => {
      if (!context.user?.user_id) return false;
      return context.loaders.comment.isLiked.load(parent.comment_id);
    },
    likesCount: async (parent, _, context: GraphqlContext) => {
      return context.loaders.comment.likesCount.load(parent.comment_id);
    }
  }
};