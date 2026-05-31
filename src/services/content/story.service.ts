import { Prisma, prisma } from '../../config/prisma.js';
import { storyRepo, storyViewRepo } from '../../Repository/instances.js';
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { userService } from '../users/account.service.js';
import { blockService } from '../interactions/block.service.js';
import { followService } from '../interactions/follow.service.js';

class StoryService {

  filterPrivateStories(stories: any[], currentUserId?: string): any[] {
    return stories.filter(story => {
      const isOwner = currentUserId === story.content.user_id;
      const isPrivate = story.content.is_private === true;

      // If story is private and not owner, exclude it
      if (isPrivate && !isOwner) return false;

      return true;
    });
  }

  async validateStoryAccess(storyOwnerId: string, currentUserId?: string) {
    const isOwner = currentUserId === storyOwnerId;

    if (!isOwner) {
      const storyOwner = await userService.getUser(storyOwnerId);
      if (!storyOwner) throw new AppError.NotFoundError('User not found');
      const isAccountPrivate = storyOwner?.profile?.is_private === true;

      // If no user logged in, they can only see public accounts
      if (!currentUserId && isAccountPrivate) throw new AppError.ForbiddenError('This account is private');

      // Logged in but not owner
      if (currentUserId) {
        const isBlocked = await blockService.checkIfBlocked(currentUserId, storyOwnerId);
        if (isBlocked) throw new AppError.ForbiddenError('You cannot view this content');

        if (isAccountPrivate) {
          const isFollowing = await followService.checkIfFollowing(currentUserId, storyOwnerId);
          if (!isFollowing) throw new AppError.ForbiddenError('This account is private');
        }
      }
    }
  }

  async deleteExpiredStories(userId: string, tx?: Prisma.TransactionClient) {
    const deleted = await storyRepo.withTx(tx).deleteExpiredByUser(userId);
    return { deleted: deleted.count };
  }

  async getStory(storyId: string, tx?: Prisma.TransactionClient) {
    const story = await storyRepo.withTx(tx).findStory(storyId);
    if (!story) throw new AppError.NotFoundError('Story not found');
    return story;
  }

  async getUserActiveStories(userId: string, tx?: Prisma.TransactionClient) {
    const stories = await storyRepo.withTx(tx).findActiveByUser(userId);
    return { stories };
  }

  async createStory(userId: string, contentId: string, input: content.StoryCreate, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {

      const activeCount = await storyRepo.withTx(tx).findActiveByUserCount(userId);
      if (activeCount >= 20)
        throw new AppError.BadRequestError('You have reached the limit of 20 active stories. Please delete some stories before creating new ones.');

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

  async hasViewed(userId: string, storyId: string) {
    return storyViewRepo.hasViewed(storyId, userId);
  }

  async getHasViewedBatch(storyIds: string[], userId: string) {
    return storyViewRepo.getHasViewedBatch(storyIds, userId);
  }

  async viewStory(userId: string, storyId: string, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      await storyViewRepo.withTx(tx).view(storyId, userId);
      const viewCount = await storyViewRepo.withTx(tx).count({
        where: { story_id: storyId }
      });
      return { viewed: true, storyId, viewCount };
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') throw new AppError.NotFoundError('Story not found');
      }
      throw e;
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

  async getViewCount(storyId: string) {
    return storyViewRepo.getViewCount(storyId);
  }

  async getViewCountsBatch(storyIds: string[]) {
    return storyViewRepo.getViewCountsBatch(storyIds);
  }
}

export const storyService = new StoryService();