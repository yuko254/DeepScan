import { Prisma } from '../../config/prisma.js';
import { categoryRepo } from '../../Repository/instances.js';
import * as refrences from "../../validations/references.schema.js";

class CategoryService {
  
  async getAll(tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).findAll();
  }

  async search(query: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).search(query);
  }

  async getById(categoryId: string, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).findById(categoryId);
  }

  async create(input: refrences.CategoryCreate, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).create({
      data: { name: input.name },
    });
  }

  async update(input: refrences.CategoryUpdate, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).update({
      where: { category_id: input.category_id },
      data: { name: input.name },
    });
  }

  async delete(categoryID: number, tx?: Prisma.TransactionClient) {
    return categoryRepo.withTx(tx).delete({
      where: { category_id: categoryID },
    });
  }
}

export const categoryService = new CategoryService();