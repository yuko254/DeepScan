import { Prisma, type story_views } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class StoryViewDao extends BaseDao<
  story_views,
  Prisma.story_viewsCreateInput,
  Prisma.story_viewsUpdateInput,
  Prisma.story_viewsWhereUniqueInput
> {
  constructor() {
    super(prisma.story_views);
  }

  async view(story_id: string, viewer_id: string): Promise<story_views> {
    return prisma.story_views.upsert({
      where: { story_id_viewer_id: { story_id, viewer_id } },
      update: { viewed_at: new Date() },
      create: {
        stories: { connect: { story_id } },
        users: { connect: { user_id: viewer_id } },
      },
    });
  }

  async hasViewed(story_id: string, viewer_id: string): Promise<boolean> {
    const view = await prisma.story_views.findUnique({
      where: { story_id_viewer_id: { story_id, viewer_id } },
    });
    return view !== null;
  }

  async getViewers(story_id: string): Promise<story_views[]> {
    return prisma.story_views.findMany({
      where: { story_id },
      include: { users: { include: { profiles: true } } },
      orderBy: { viewed_at: 'desc' },
    });
  }
}
