import { Prisma, type hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class HashtagDao extends BaseDao<
  hashtags,
  Prisma.hashtagsCreateInput,
  Prisma.hashtagsUpdateInput,
  Prisma.hashtagsWhereUniqueInput
> {
  constructor() {
    super(prisma.hashtags);
  }

  async findByName(name: string): Promise<hashtags | null> {
    return prisma.hashtags.findUnique({ where: { name } });
  }

  async findOrCreate(name: string): Promise<hashtags> {
    return prisma.hashtags.upsert({
      where: { name },
      update: { post_count: { increment: 1 } },
      create: { name, post_count: 1 },
    });
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
