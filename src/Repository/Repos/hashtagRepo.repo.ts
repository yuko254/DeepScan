import { Prisma, type hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class HashtagRepo extends BaseRepository<
    typeof prisma.hashtags
> {
  constructor() {
    super(prisma.hashtags, 'hashtags', 'hashtag_id');
  }

  async findByName(name: string): Promise<hashtags | null> {
    return prisma.hashtags.findUnique({ where: { name } });
  }

  async search(query: string): Promise<hashtags[]> {
    return prisma.hashtags.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { post_count: 'desc' },
      take: 20,
    });
  }

  async getTrending(take = 10): Promise<hashtags[]> {
    return prisma.hashtags.findMany({ orderBy: { post_count: 'desc' }, take });
  }
}
