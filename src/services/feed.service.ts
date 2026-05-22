import { followRepo, postRepo, storyRepo } from '../Repository/instances.js';

export class FeedService {
  async getHomeFeed(user_id?: string, cursor: string | Date = new Date(), limit = 50) {
    const cursorDate = cursor instanceof Date ? cursor : new Date(cursor);

    // Get following ids (only if authenticated)
    let owners: string[] = [];
    if (user_id) {
      const following = await followRepo.getFollowing(user_id);
      const followingIds = (following as Array<{ following_id: string }>).map((f) => f.following_id);
      owners = [user_id, ...followingIds];
    }

    // Build where clause for posts
    const where: any = {
      content: {
        is_deleted: false,
        created_at: { lt: cursorDate }
      }
    };

    // Add visibility filter
    if (user_id) {
      where.OR = [
        { content: { user_id: { in: owners } } },
        { content: { visibility: 'public' } }
      ];
    } else {
      where.content.visibility = 'public';
    }

    const posts = await postRepo.findMany({
      where,
      include: {
        content: { include: { user: { include: { profile: true } } } },
        location: { include: { city: true, country: true } },
        category: true,
        postTags: { include: { tag: true } },
        _count: {
          select: {
            post_likes: true,
            comments: true,
            saved_posts: true
          }
        }
      },
      orderBy: { content: { created_at: 'desc' } },
      take: limit + 1,
    });

    // Handle pagination
    let nextCursor = null;
    let pagePosts = posts;
    if (posts.length > limit) {
      const last = posts[limit];
      nextCursor = last?.content?.created_at ?? null;
      pagePosts = posts.slice(0, limit);
    }

    // Build where clause for stories
    const storyWhere: any = {
      content: { is_deleted: false },
      expires_at: { gt: new Date() }
    };

    if (user_id) {
      storyWhere.OR = [
        { content: { user_id: { in: owners } } },
        { content: { visibility: 'public' } }
      ];
    } else {
      storyWhere.content.visibility = 'public';
    }

    const stories = await storyRepo.findMany({
      where: storyWhere,
      include: {
        content: { include: { user: { include: { profile: true } } } },
        _count: { select: { story_views: true } }
      },
      orderBy: { expires_at: 'asc' },
    }).catch(() => []);

    // Format posts with computed fields
    const formattedPosts = pagePosts.map((post: any) => ({
      ...post,
      likesCount: post._count?.post_likes ?? 0,
      commentsCount: post._count?.comments ?? 0,
      savesCount: post._count?.saved_posts ?? 0,
      _count: undefined
    }));

    // Format stories with computed fields
    const formattedStories = stories.map((story: any) => ({
      ...story,
      viewCount: story._count?.story_views ?? 0,
      hasViewed: false,
      _count: undefined
    }));

    return { posts: formattedPosts, stories: formattedStories, nextCursor };
  }
}

export const feedService = new FeedService();