import { Prisma } from '../../config/prisma.js';
import { categoryRepo } from '../../Repository/instances.js';

export class CategoryService {
  
  async getAll(tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).findAll();
  }

  async search(query: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).search(query);
  }

  async getById(categoryId: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).findById(categoryId);
  }

  async create(name: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).create({
      data: { name },
    });
  }

  async update(categoryID: number, name: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).update({
      where: { category_id: categoryID },
      data: { name },
    });
  }

  async delete(categoryID: number, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).delete({
      where: { category_id: categoryID },
    });
  }
}

export const categoryService = new CategoryService();