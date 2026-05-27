import type { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { userService } from '../../services/users/account.service.js';
import { followService } from '../../services/interactions/follow.service.js';
import { blockService } from '../../services/interactions/block.service.js';
import * as userSchema from '../../validations/user.schema.js'
import { querySchema } from '../../validations/search.schema.js'
import * as AppError from '../../types/appErrors.types.js';

export const userResolver: Resolvers = {
  Query: {
    me: async (_, __, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const user = await userService.getUser(context.user.user_id);
      return user as any;
    },

    user: async (_, args) => {
      const input = userSchema.UserIdParamSchema.parse({ user_id: args.id });
      const user = await userService.getUser(input.user_id);
      return user as any;
    },

    users: async (_, args) => {
      const input = querySchema.parse(args);
      if (!input.search) return { users: [], nextCursor: null };
      const users = await userService.searchUsers(input.search, input.cursor ?? undefined, args.limit ?? undefined);
      return users as any;
    },

    myDeviceTokens: async (_, __, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.getUserDeviceTokens(context.user.user_id) as any;
    },

    deviceToken: async (_, args, context) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.getDeviceToken(args.id, context.user.user_id) as any;
    }
  },

  Mutation: {
    registerDeviceToken: async (_, { data }, context) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.registerDeviceToken(context.user.user_id, data.token, data.device_type, data.app_version) as any;
    },

    updateDeviceToken: async (_, { data }, context) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.updateDeviceToken(context.user.user_id, data.token_id, { device_type: data.device_type ?? undefined, app_version: data.app_version ?? undefined }) as any;
    },

    unregisterDeviceToken: async (_, { tokenId }, context) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.unregisterDeviceToken(context.user.user_id, tokenId) as any;
    },

    unregisterAllDeviceTokens: async (_, __, context) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return userService.unregisterAllDeviceTokens(context.user.user_id) as any;
    }
  },

  users: {
    isMe: (parent, _, context: GraphqlContext) => parent.user_id === context.user?.user_id,

    isFollowing: async (parent, _, context: GraphqlContext) => {
      if (!context.user?.user_id || context.user.user_id === parent.user_id) return false;
      return followService.checkIfFollowing(context.user.user_id, parent.user_id);
    },

    isBlocked: async (parent, _, context: GraphqlContext) => {
      if (!context.user?.user_id || context.user.user_id === parent.user_id) return false;
      return blockService.checkIfBlocked(context.user.user_id, parent.user_id);
    },

    followersCount: async (parent) => {
      const counts = await followService.getFollowCounts(parent.user_id);
      return counts.followersCount;
    },

    followingCount: async (parent) => {
      const counts = await followService.getFollowCounts(parent.user_id);
      return counts.followingCount;
    },
  },
};