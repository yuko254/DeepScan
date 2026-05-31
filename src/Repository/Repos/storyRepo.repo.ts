<<<<<<< HEAD
import { stories } from "@prisma/client";
=======
>>>>>>> dev
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class StoryRepo extends BaseRepository<typeof prisma.stories> {
  constructor() {
    super(prisma.stories, 'stories', 'content_id');
  }

  private includeDetails = {
    content: { include: { user: { include: { profile: true } } } },
  }

  async findStory(story_id: string) {
    return this.model.findUnique({
      where: { content_id: story_id },
      include: this.includeDetails
    });
  }

  async findActiveByUser(user_id: string) {
    return this.model.findMany({
      where: {
<<<<<<< HEAD
        content: { user_id },
=======
        content: { user_id, is_deleted: false },
>>>>>>> dev
        expires_at: { gt: new Date() },
      },
      include: this.includeDetails,
      orderBy: { expires_at: 'asc' },
    });
  }

<<<<<<< HEAD
=======
  async findActiveByUserCount(user_id: string) {
    return this.model.count({
      where: {
        content: { user_id, is_deleted: false },
        expires_at: { gt: new Date() },
      },
    });
  }

>>>>>>> dev
  async findActiveFeed(user_ids: string[]) {
    if (!user_ids.length) return [];

    const stories = await this.model.findMany({
      where: {
        content: { user_id: { in: user_ids } },
        expires_at: { gt: new Date() },
      },
      include: this.includeDetails,
      orderBy: { expires_at: 'asc' },
    });

<<<<<<< HEAD
    // Generic to infer return type
=======
>>>>>>> dev
    type GroupedStories = {
      [key: string]: {
        user: typeof stories[number]['content']['user'];
        stories: typeof stories;
      };
    };

    const groupedStories = stories.reduce<GroupedStories>((acc, story) => {
      const userId = story.content.user_id;
      if (!acc[userId]) {
        acc[userId] = {
          user: story.content.user,
          stories: []
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {} as GroupedStories);

    return Object.values(groupedStories);
  }
<<<<<<< HEAD
=======

  async deleteExpiredByUser(user_id: string) {
    return this.model.deleteMany({
      where: {
        content: { user_id },
        type: 'story',
        story: { expires_at: { lt: new Date() }},
      }
    });
  }
>>>>>>> dev
}
