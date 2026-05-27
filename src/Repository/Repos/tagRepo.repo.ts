import { type tags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class TagRepo extends BaseRepository<typeof prisma.tags> {
  constructor() {
    super(prisma.tags, 'tags', 'tag_id');
  }

  async findByName(name: string) {
    return this.model.findUnique({ where: { name } });
  }

  async findAll() {
    return this.model.findMany({ orderBy: { name: 'asc' } });
  }

  async search(query: string) {
    return this.model.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }
}
