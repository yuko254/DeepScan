import { Prisma, type stories } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class StoryDao extends BaseDao<
  stories,
  Prisma.storiesCreateInput,
  Prisma.storiesUpdateInput,
  Prisma.storiesWhereUniqueInput
> {
  constructor() {
    super(prisma.stories);
  }

  async findActiveByUser(user_id: string): Promise<stories[]> {
    return prisma.stories.findMany({
      where: { user_id, expires_at: { gt: new Date() } },
      include: { media: true },
      orderBy: { expires_at: 'asc' },
    });
  }

  async findActiveFeed(user_ids: string[]): Promise<stories[]> {
    return prisma.stories.findMany({
      where: { user_id: { in: user_ids }, expires_at: { gt: new Date() } },
      include: { media: true, users: { include: { profiles: true } } },
      orderBy: { expires_at: 'asc' },
    });
  }

  async findWithViews(story_id: string): Promise<stories | null> {
    return prisma.stories.findUnique({
      where: { story_id },
      include: { story_views: true },
    });
  }
}
