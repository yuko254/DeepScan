import { Prisma, prisma } from '../../config/prisma.js';
import type { StoriesCreateInput } from '../../graphql/generated/graphql.js';
import { storyRepo, contentRepo } from '../../Repository/instances.js';
import * as AppError from '../../types/appErrors.types.js';

export class StoryService {

  async getStory(storyId: string) {
    const story = await storyRepo.findByIdWithDetails(storyId);
    if (!story) throw new AppError.NotFoundError('Story not found');
    return story;
  }

  async getUserActiveStories(userId: string, currentUserId?: string) {
    // Delete expired stories first
    await this.deleteExpiredStories(userId);

    // Get active stories for user
    const stories = await prisma.stories.findMany({
      where: {
        content: {
          user_id: userId,
          is_deleted: false
        },
        expires_at: {
          gt: new Date()
        }
      },
      include: {
        content: true,
        _count: { select: { story_views: true } }
      },
      orderBy: { content: { created_at: 'desc' } }
    });

    // Check if current user has viewed each story
    let storiesWithDetails = await Promise.all(
      stories.map(async (story) => {
        let hasViewed = false;
        if (currentUserId) {
          const view = await prisma.story_views.findUnique({
            where: {
              viewer_id_story_id: {
                viewer_id: currentUserId,
                story_id: story.content_id
              }
            }
          });
          hasViewed = !!view;
        }

        return {
          ...story,
          viewCount: story._count.story_views,
          hasViewed,
          _count: undefined
        };
      })
    );

    return { stories: storiesWithDetails };
  }

  async createStory(contentId: string, userId: string, input: StoriesCreateInput, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Delete expired stories first
      await this.deleteExpiredStories(userId, tx);

      // Count active stories
      const activeCount = await tx.stories.count({
        where: {
          content: {
            user_id: userId,
            is_deleted: false
          },
          expires_at: { gt: new Date() }
        }
      });

      // Check limit (max 20 active stories)
      if (activeCount >= 20) {
        throw new AppError.BadRequestError('You have reached the limit of 20 active stories. Please delete some stories before creating new ones.');
      }

      // Calculate expiration (default 24 hours from now)
      const expiresAt = input.expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create the story
      const story = await storyRepo.withTx(tx).create({
        data: {
          content_id: contentId,
          expires_at: expiresAt,
        }
      });

      return story;
    });
  }

  async deleteExpiredStories(userId: string, tx?: Prisma.TransactionClient) {
    const executor = tx || prisma;

    const deleted = await executor.contents.deleteMany({
      where: {
        user_id: userId,
        type: 'story',
        story: {
          expires_at: { lt: new Date() }
        },
      }
    });

    return { deleted: deleted.count };
  }

  async viewStory(userId: string, storyId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      // Check if story exists and is not expired
      const story = await storyRepo.withTx(tx).findUnique({
        where: {
          content_id: storyId,
          expires_at: { gt: new Date() }
        }
      });

      if (!story) throw new AppError.NotFoundError('Story not found or expired');

      // Check if already viewed
      const existingView = await tx.story_views.findUnique({
        where: {
          viewer_id_story_id: {
            viewer_id: userId,
            story_id: storyId
          }
        }
      });

      let viewed = false;
      if (!existingView) {
        await tx.story_views.create({
          data: {
            viewer_id: userId,
            story_id: storyId
          }
        });
        viewed = true;
      }

      // Get updated view count
      const viewCount = await tx.story_views.count({
        where: { story_id: storyId }
      });

      return { viewed, storyId, viewCount };
    });
  }

  async getStoryViewers(storyId: string) {
    const views = await prisma.story_views.findMany({
      where: { story_id: storyId },
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { viewed_at: 'desc' }
    });

    return { viewers: views };
  }

  async hasUserViewedStory(userId: string, storyId: string): Promise<boolean> {
    const view = await prisma.story_views.findUnique({
      where: {
        viewer_id_story_id: {
          viewer_id: userId,
          story_id: storyId
        }
      }
    });
    return !!view;
  }
}

export const storyService = new StoryService();