import { type stories } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class StoryRepo extends BaseRepository<typeof prisma.stories> {
  constructor() {
    super(prisma.stories, 'stories', 'content_id'); // fix: PK is content_id
  }

  async findByIdWithDetails(storyId: string, currentUserId?: string) {
    const story = await this.model.findUnique({
      where: { content_id: storyId },
      include: {
        content: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        }
      }
    });

    if (!story) return null;

    // Run both queries in parallel
    const [viewCount, view] = await Promise.all([
      prisma.story_views.count({
        where: { story_id: storyId }
      }),
      currentUserId ? prisma.story_views.findUnique({
        where: {
          viewer_id_story_id: {
            viewer_id: currentUserId,
            story_id: storyId
          }
        }
      }) : Promise.resolve(null)
    ]);

    return {
      ...story,
      viewCount,
      hasViewed: !!view
    };
  }

  async findActiveByUser(user_id: string) {
    return this.model.findMany({
      where: {
        content: { user_id },
        expires_at: { gt: new Date() },
      },
      include: { content: true },
      orderBy: { expires_at: 'asc' },
    });
  }

  async findActiveFeed(user_ids: string[]) {
    return this.model.findMany({
      where: {
        content: { user_id: { in: user_ids } },
        expires_at: { gt: new Date() },
      },
      include: {
        content: { include: { user: { include: { profile: true } } } },
      },
      orderBy: { expires_at: 'asc' },
    });
  }
}
