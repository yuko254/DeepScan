import { Prisma, type categories } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class CategoryDao extends BaseDao<
  categories,
  Prisma.categoriesCreateInput,
  Prisma.categoriesUpdateInput,
  Prisma.categoriesWhereUniqueInput
> {
  constructor() {
    super(prisma.categories);
  }

  async findByName(category_name: string): Promise<categories | null> {
    return prisma.categories.findUnique({ where: { category_name } });
  }

  async findAll(): Promise<categories[]> {
    return prisma.categories.findMany({ orderBy: { category_name: 'asc' } });
  }
}
