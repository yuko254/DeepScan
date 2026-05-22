import { Prisma } from '../../config/prisma.js';
import { tagRepo, postTagRepo } from '../../Repository/instances.js';

export class TagService {

  async getAll(tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).findAll();
  }

  async search(query: string, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).search(query);
  }

  async getById(tagID: number, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).findById(tagID);
  }

  async create(name: string, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).create({
      data: { name },
    });
  }

  async update(tagID: number, name: string, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).update({
      where: { tag_id: tagID },
      data: { name },
    });
  }

  async delete(tagID: number, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).deleteById(tagID);
  }

  async scanAndLinkForPost(postId: string, tagIDs?: number[] | null, tx?: Prisma.TransactionClient) {
    if (!tagIDs || tagIDs.length === 0) return
    await postTagRepo.withTx(tx).createMany(
      tagIDs.map(tagId => ({ post_id: postId, tag_id: tagId })),
      { skipDuplicates: true }
    )
  }
}

export const tagService = new TagService();