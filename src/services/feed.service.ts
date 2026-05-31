import { blockRepo, followRepo, postRepo, storyRepo } from '../Repository/instances.js';

class FeedService {
  async getPostFeed(user_id?: string, cursor?: Date, limit = 50) {
    let ownerIds: string[] = [];
    let blockedUsers: Set<string> = new Set();
    let blockedBy: Set<string> = new Set();

    if (user_id) {
      // Get users I follow
      const followingIds = await followRepo.findFollowingIds(user_id);
      ownerIds = [...followingIds];

      // Get block relationships (users I blocked + users who blocked me)
      const blockRelations = await blockRepo.findBlockEitherIds(user_id);
      blockedUsers = blockRelations.blockedUsers;
      blockedBy = blockRelations.blockedBy;
    }

    // Get feed posts
    let { posts, nextCursor } = await postRepo.findFeedPosts(ownerIds, cursor, limit);

    if (user_id) {
      posts = posts.filter(post => {
        const postOwnerId = post.content.user_id;
        // Don't show posts from blocked users or users who blocked me
        return !blockedUsers.has(postOwnerId) && !blockedBy.has(postOwnerId);
      });
    }

    return { posts, nextCursor };
  }

  async getStoryFeed(user_id: string) {
    const followingIds = await followRepo.findFollowingIds(user_id);
    const ownerIds = [...followingIds];

    const storyGroups = await storyRepo.findActiveFeed(ownerIds);

    return { storyGroups };
  }

  // Keep original for backward compatibility if needed
  async getHomeFeed(user_id?: string, cursor?: Date, limit = 50) {
    const [postFeed, storyFeed] = await Promise.all([
      this.getPostFeed(user_id, cursor, limit),
      user_id ? this.getStoryFeed(user_id) : Promise.resolve({ storyGroups: [] })
    ]);

    return {
      posts: postFeed.posts,
      stories: storyFeed.storyGroups,
      nextCursor: postFeed.nextCursor
    };
  }
}

export const feedService = new FeedService();