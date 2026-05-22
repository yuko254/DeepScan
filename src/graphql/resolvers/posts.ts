import type { Resolvers, QueryPostArgs, MutationDeletePostArgs, Users } from '../graphql.js';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import { PostService } from '../../services/content/post.service.js';

type GraphQLContext = { req: Request; user?: Users | null; prisma: PrismaClient };

const postService = new PostService();

export const postResolvers: Partial<Resolvers<GraphQLContext>> = {
  Query: {
    post: async (_parent, args: QueryPostArgs, _ctx) => {
      const { id } = args;
      return await postService.getPost(id);
    },
  },
  Mutation: {
    deletePost: async (_parent, args: MutationDeletePostArgs, ctx) => {
      const adminId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await postService.deletePost(args.id, adminId);
    },
  },
  posts: {},
};
