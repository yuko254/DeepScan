import { prisma } from '../../config/prisma.js';
import type { GraphqlContext } from '../../dtos/dto.js';
import { feedService } from '../../services/feed.service.js';
import { blockService } from '../../services/interactions/block.service.js';
import type { Resolvers, QueryFeedArgs, Feed } from '../generated/graphql.js';

export const feedResolver: Resolvers = {
  Query: {
    feed: async (_, args: QueryFeedArgs, context: GraphqlContext): Promise<Feed> => {
      const userId = context.user?.user_id;

      // Get feed data (already has counts, viewCount)
      const { posts, stories, nextCursor } = await feedService.getHomeFeed(
        userId || undefined,
        args.cursor ?? undefined,
        args.limit ?? undefined
      );
      
      // Filter blocked users
      let filteredPosts = posts;
      let filteredStories = stories;
      
      if (userId) {
        const blocked = await blockService.getBlockedUsers(userId);
        const blockedIds = blocked.blockedUsers.map(b => b.blocked_id);
        filteredPosts = posts.filter(p => !blockedIds.includes(p.content?.user_id));
        filteredStories = stories.filter(s => !blockedIds.includes(s.content?.user_id));
      }
      
      // Enrich with user-specific flags (isLiked, isSaved, hasViewed)
      const { posts: enrichedPosts, stories: enrichedStories } = await enrichFeedItems(
        filteredPosts,
        filteredStories,
        userId
      );
      
      return {
        posts: enrichedPosts,
        stories: enrichedStories,
        nextCursor,
      };
    }
  }
};

async function enrichFeedItems(posts: any[], stories: any[], userId?: string) {
  if (!userId) {
    return { posts, stories };
  }

  const postIds = posts.map(p => p.content_id);
  const storyIds = stories.map(s => s.content_id);

  // Batch fetch user interactions
  const [likes, saves, storyViews] = await Promise.all([
    prisma.post_likes.findMany({
      where: { post_id: { in: postIds }, user_id: userId },
      select: { post_id: true }
    }),
    prisma.saved_posts.findMany({
      where: { post_id: { in: postIds }, user_id: userId },
      select: { post_id: true }
    }),
    prisma.story_views.findMany({
      where: { story_id: { in: storyIds }, viewer_id: userId },
      select: { story_id: true }
    })
  ]);

  const likedSet = new Set(likes.map(l => l.post_id));
  const savedSet = new Set(saves.map(s => s.post_id));
  const viewedSet = new Set(storyViews.map(v => v.story_id));

  const enrichedPosts = posts.map(post => ({
    ...post,
    isLiked: likedSet.has(post.content_id),
    isSaved: savedSet.has(post.content_id)
  }));

  const enrichedStories = stories.map(story => ({
    ...story,
    hasViewed: viewedSet.has(story.content_id)
  }));

  return { posts: enrichedPosts, stories: enrichedStories };
}
