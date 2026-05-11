import { Prisma, type story_views } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class StoryViewRepo extends BaseRepository<
  typeof prisma.story_views
> {
  constructor() {
    super(prisma.story_views, 'story_views');
  }

  async view(story_id: string, viewer_id: string): Promise<story_views> {
    return prisma.story_views.upsert({
      where: { viewer_id_story_id: { story_id, viewer_id } },
      update: { viewed_at: new Date() },
      create: {
        story: { connect: { story_id } },
        users: { connect: { user_id: viewer_id } },
      },
    });
  }

  async hasViewed(story_id: string, viewer_id: string): Promise<boolean> {
    const view = await prisma.story_views.findUnique({
      where: { viewer_id_story_id: { story_id, viewer_id } },
    });
    return view !== null;
  }

  async getViewers(story_id: string): Promise<story_views[]> {
    return prisma.story_views.findMany({
      where: { story_id },
      include: { user: { include: { profile: true } } },
      orderBy: { viewed_at: 'desc' },
    });
  }
}
