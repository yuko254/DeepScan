import { type hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class HashtagRepo extends BaseRepository<typeof prisma.hashtags> {
  constructor() {
    super(prisma.hashtags, 'hashtags', 'hashtag_id');
  }

  async findByName(name: string) {
    return this.model.findUnique({ where: { name } });
  }

  async findOrCreateByName(name: string) {
    return this.model.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async search(query: string) {
    return this.model.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }

  /** Trending via the hashtag_usage view, joined back to hashtags */
  async getTrending(take = 10) {
    // 1. Get top hashtag IDs + counts from the view
    const trending = await prisma.hashtag_usage.findMany({
      orderBy: { usage_count: 'desc' },
      take,
    });

    if (trending.length === 0) return [];

    const hashtagIds = trending.map(t => t.hashtag_id);

    // 2. Fetch the full hashtag records
    const hashtags = await this.model.findMany({
      where: { hashtag_id: { in: hashtagIds } },
    });

    // 3. Re‑order to match the view’s ranking
    const hashtagMap = new Map(hashtags.map(h => [h.hashtag_id, h]));
    return hashtagIds
      .map(id => hashtagMap.get(id))
      .filter((h): h is typeof hashtags[0] => h !== undefined);
  }
}
