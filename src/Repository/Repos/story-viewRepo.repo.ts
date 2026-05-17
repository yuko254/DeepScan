import { type story_views } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class StoryViewRepo extends BaseRepository<typeof prisma.story_views> {
  constructor() {
    super(prisma.story_views, 'story_views');
  }

  async view(story_id: string, viewer_id: string) {
    return this.model.upsert({
      where: { viewer_id_story_id: { story_id, viewer_id } },
      update: { viewed_at: new Date() },
      create: {
        story: { connect: { content_id: story_id } }, // stories PK is content_id
        user: { connect: { user_id: viewer_id } },    // fix: was 'users'
      },
    });
  }

  async hasViewed(story_id: string, viewer_id: string) {
    const view = await this.model.findUnique({
      where: { viewer_id_story_id: { story_id, viewer_id } },
    });
    return view !== null;
  }

  async getViewers(story_id: string) {
    return this.model.findMany({
      where: { story_id },
      include: { user: { include: { profile: true } } }, // fix: was 'users'
      orderBy: { viewed_at: 'desc' },
    });
  }

  async getViewCount(story_id: string) {
    return this.model.count({ where: { story_id } });
  }
}
