import { type hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class HashtagRepo extends BaseRepository<typeof prisma.hashtags> {
  constructor() {
    super(prisma.hashtags, 'hashtags', 'hashtag_id');
  }

  async findByName(name: string): Promise<hashtags | null> {
    return prisma.hashtags.findUnique({ where: { name } });
  }

  async findOrCreateByName(name: string): Promise<hashtags> {
    return prisma.hashtags.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async search(query: string): Promise<hashtags[]> {
    return prisma.hashtags.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 20,
    });
  }

  /** Trending via the hashtag_usage view, joined back to hashtags */
  async getTrending(take = 10): Promise<hashtags[]> {
    const usages = await prisma.hashtag_usage.findMany({
      orderBy: { usage_count: 'desc' },
      take,
    });
    const ids = usages.map((u) => u.hashtag_id);
    const rows = await prisma.hashtags.findMany({ where: { hashtag_id: { in: ids } } });
    // Preserve ranking order
    const map = new Map(rows.map((h) => [h.hashtag_id, h]));
    return ids.map((id) => map.get(id)!).filter(Boolean);
  }
}
