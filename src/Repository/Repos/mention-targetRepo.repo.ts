import { type mention_targets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MentionTargetRepo extends BaseRepository<typeof prisma.mention_targets> {
  constructor() {
    super(prisma.mention_targets, 'mention_targets', 'target_id');
  }

  async findOrCreateForPost(post_id: string) {
    const existing = await this.model.findFirst({ where: { post_id } });
    if (existing) return existing;
    return this.model.create({ data: { post: { connect: { content_id: post_id } } } });
  }

  async findOrCreateForComment(comment_id: string) {
    const existing = await this.model.findFirst({ where: { comment_id } });
    if (existing) return existing;
    return this.model.create({ data: { comment: { connect: { comment_id } } } });
  }

  async findByPost(post_id: string) {
    return this.model.findFirst({ where: { post_id }, include: { mentions: true } });
  }

  async findByComment(comment_id: string) {
    return this.model.findFirst({ where: { comment_id }, include: { mentions: true } });
  }
}
