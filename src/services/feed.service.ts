import { followRepo, postRepo, storyRepo } from '../Repository/instances.js';
import { blockService } from './interactions/block.service.js';

class FeedService {
  async getHomeFeed(user_id?: string, cursor?: Date, limit = 50) {
    let ownerIds: string[] = [];
    let stories: Awaited<ReturnType<typeof storyRepo.findActiveFeed>> = [];

    if (user_id) {
      const following = await followRepo.getFollowing(user_id);
      const followingIds = following.map((f) => f.following_id);
      ownerIds = [user_id, ...followingIds];

      const storyGroups = await storyRepo.findActiveFeed(ownerIds);
      const blockedUserIds = await blockService.getBlockedUserIds(user_id);
      stories = storyGroups.filter(group => !blockedUserIds.includes(group.user.user_id));
    }

    let { posts, nextCursor } = await postRepo.findFeedPosts(
      ownerIds,
      cursor,
      limit,
    );

    if (user_id) {
      const blockedUserIds = await blockService.getBlockedUserIds(user_id);
      posts = posts.filter(post => !blockedUserIds.includes(post.content.user_id)) as typeof posts;
    }

    return { posts, stories, nextCursor };
  }
}

export const feedService = new FeedService();