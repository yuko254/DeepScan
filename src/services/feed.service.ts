import { followRepo, postRepo, storyRepo } from '../Repository/instances.js';
import { blockService } from './interactions/block.service.js';

class FeedService {
  async getPostFeed(user_id?: string, cursor?: Date, limit = 50) {
    let ownerIds: string[] = [];

    if (user_id) {
      const following = await followRepo.getFollowing(user_id);
      const followingIds = following.map((f) => f.following_id);
      ownerIds = [...followingIds];
    }

    let { posts, nextCursor } = await postRepo.findFeedPosts(ownerIds, cursor, limit);

    if (user_id) {
      const blockedUserIds = await blockService.getBlockedUserIds(user_id);
      posts = posts.filter(post => !blockedUserIds.includes(post.content.user_id));
    }

    return { posts, nextCursor };
  }

  async getStoryFeed(user_id: string) {
    const following = await followRepo.getFollowing(user_id);
    const followingIds = following.map((f) => f.following_id);
    const ownerIds = [user_id, ...followingIds];

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