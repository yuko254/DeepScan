import { type tags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class TagRepo extends BaseRepository<typeof prisma.tags> {
  constructor() {
    super(prisma.tags, 'tags', 'tag_id');
  }

  async findByName(name: string): Promise<tags | null> {
    return prisma.tags.findUnique({ where: { name } });
  }

  async findOrCreateByName(name: string): Promise<tags> {
    return prisma.tags.upsert({ where: { name }, update: {}, create: { name } });
  }

  async findAll(): Promise<tags[]> {
    return prisma.tags.findMany({ orderBy: { name: 'asc' } });
  }

  async search(query: string): Promise<tags[]> {
    return prisma.tags.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }
}
