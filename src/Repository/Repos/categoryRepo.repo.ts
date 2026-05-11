import { Prisma, type categories } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CategoryRepo extends BaseRepository<
  typeof prisma.categories
> {
  constructor() {
    super(prisma.categories, 'categories', 'category_id');
  }

  async findByName(name: string): Promise<categories | null> {
    return prisma.categories.findUnique({ where: { name } });
  }

  async findAll(): Promise<categories[]> {
    return prisma.categories.findMany({ orderBy: { name: 'asc' } });
  }
}
