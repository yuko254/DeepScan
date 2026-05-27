import { type post_tags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostTagRepo extends BaseRepository<typeof prisma.post_tags> {
  constructor() {
    super(prisma.post_tags, 'post_tags', undefined);
  }

  async findById() {
    throw new Error('PostTagRepo does not support findById — use findUnique with composite key { post_id, tag_id }');
  }

  async findByPost(post_id: string) {
    return this.model.findMany({
      where: { post_id },
      include: { tag: true },
    });
  }

  async findByTag(tag_id: number) {
    return this.model.findMany({
      where: { tag_id },
      include: { post: true },
    });
  }

  async attach(post_id: string, tag_id: number) {
    return this.model.create({
      data: {
        post: { connect: { content_id: post_id } },
        tag: { connect: { tag_id } },
      },
    });
  }

  async detach(post_id: string, tag_id: number) {
    return this.model.delete({
      where: { post_id_tag_id: { post_id, tag_id } },
    });
  }

  async sync(post_id: string, tag_ids: number[]) {
    await this.model.deleteMany({ where: { post_id } });
    if (tag_ids.length > 0) {
      await this.model.createMany({
        data: tag_ids.map((tag_id) => ({ post_id, tag_id })),
      });
    }
  }
}
