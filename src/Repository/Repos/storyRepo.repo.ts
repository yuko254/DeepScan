import { type stories } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class StoryRepo extends BaseRepository<typeof prisma.stories> {
  constructor() {
    super(prisma.stories, 'stories', 'content_id'); // fix: PK is content_id
  }

  async findActiveByUser(user_id: string) {
    return this.model.findMany({
      where: {
        content: { user_id },
        expires_at: { gt: new Date() },
      },
      include: { content: { include: { media: true } } },
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
        content: { include: { media: true, user: { include: { profile: true } } } },
      },
      orderBy: { expires_at: 'asc' },
    });
  }

  async findWithViews(content_id: string) {
    return this.model.findUnique({
      where: { content_id },
      include: { story_views: true },
    });
  }

  async expireOld() {
    // Stories past expiry can be cleaned up — delete their parent content to cascade
    const expired = await this.model.findMany({
      where: { expires_at: { lt: new Date() } },
      select: { content_id: true },
    });
    await this.model.deleteMany({
      where: { content_id: { in: expired.map((s) => s.content_id) } },
    });
  }
}
