import type { Resolvers, MutationCreateCommentArgs, MutationUpdateCommentArgs, MutationDeleteCommentArgs, Users } from '../graphql.js';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import { CommentService } from '../../services/interactions/comment.service.js';

type GraphQLContext = { req: Request; user?: Users | null; prisma: PrismaClient };

const commentService = new CommentService();

export const commentResolvers: Partial<Resolvers<GraphQLContext>> = {
  Query: {},
  Mutation: {
    createComment: async (_parent, args: MutationCreateCommentArgs, ctx) => {
      const userId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await commentService.createComment({ ...(args.data as unknown as Record<string, unknown>), user_id: userId });
    },
    updateComment: async (_parent, args: MutationUpdateCommentArgs, _ctx) => {
      return await commentService.updateComment(args.id, args.data as unknown as Record<string, unknown>);
    },
    deleteComment: async (_parent, args: MutationDeleteCommentArgs, ctx) => {
      const adminId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await commentService.deleteComment(args.id, adminId);
    },
  },
  comments: {},
};