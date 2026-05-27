import type { Resolvers, QueryFeedArgs, Feed } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { feedService } from '../../services/feed.service.js';
import { querySchema } from '../../validations/search.schema.js'
import * as AppError from '../../types/appErrors.types.js';

export const feedResolver: Resolvers = {
  Query: {
    feed: async (_, args, context: GraphqlContext): Promise<Feed> => {
      const input = querySchema.parse(args);
      const userId = context.user?.user_id;

      const { posts, stories, nextCursor } = await feedService.getHomeFeed(
        userId,
        input.cursor ?? undefined,
        input.limit ?? undefined
      );

      return {
        posts: posts as any,
        stories: stories as any,
        nextCursor: nextCursor ?? null,
      };
    }
  }
};