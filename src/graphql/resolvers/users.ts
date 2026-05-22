import type { Resolvers, MutationCreateUserArgs, MutationUpdateUserArgs, MutationDeleteUserArgs, Users } from '../graphql.js';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import { UserService } from '../../services/userAccount.service.js';

type GraphQLContext = { req: Request; user?: Users | null; prisma: PrismaClient };

const userService = new UserService();

export const userResolvers: Partial<Resolvers<GraphQLContext>> = {
  Query: {
    me: async (_parent, _args, ctx) => {
      const userId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      if (!userId) throw new Error('Authentication required');
      return await userService.getAccount(userId);
    },
  },
  Mutation: {
    createUser: async (_parent, args: MutationCreateUserArgs, _ctx) => {
      return await userService.createUser(args.data as unknown as Record<string, unknown>);
    },
    updateUser: async (_parent, args: MutationUpdateUserArgs, ctx) => {
      const adminId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await userService.updateUser(args.id, args.data as unknown as Record<string, unknown>, adminId);
    },
    deleteUser: async (_parent, args: MutationDeleteUserArgs, ctx) => {
      const adminId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await userService.deleteUser(args.id, adminId);
    },
  },
  users: {},
};
