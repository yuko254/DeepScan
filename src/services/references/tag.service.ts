import { Prisma } from '../../config/prisma.js';
import { tagRepo, postTagRepo } from '../../Repository/instances.js';
import * as refrences from "../../validations/references.schema.js";

class TagService {

  async getAll(tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).findAll();
  }

  async search(query: string, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).search(query);
  }

  async getById(tagID: number, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).findById(tagID);
  }

  async create(input: refrences.TagCreate, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).create({
      data: { name: input.name },
    });
  }

  async update(input: refrences.TagUpdate, tx?: Prisma.TransactionClient) {
    return tagRepo.withTx(tx).update({
      where: { tag_id: input.tag_id },
      data: { name: input.name },
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