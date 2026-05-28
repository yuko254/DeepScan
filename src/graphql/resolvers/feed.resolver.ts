import type { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { feedService } from '../../services/feed.service.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';

export const feedResolver: Resolvers = {
  Query: {
    postFeed: async (_, args, context: GraphqlContext) => {
      const input = querySchema.parse(args);
      const userId = context.user?.user_id;

      const { posts, nextCursor } = await feedService.getPostFeed(
        userId,
        input.cursor ?? undefined,
        input.limit ?? 50
      );

      return {
        posts: posts as any,
        nextCursor: nextCursor ?? null,
      };
    },

    storyFeed: async (_, __, context: GraphqlContext) => {
      if (!context.user?.user_id) {
        throw new AppError.UnauthorizedError('Authentication required');
      }

      const { storyGroups } = await feedService.getStoryFeed(context.user.user_id);

      return {
        groups: storyGroups as any,
      };
    },
  },
};