import { type mention_targets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MentionTargetRepo extends BaseRepository<typeof prisma.mention_targets> {
  constructor() {
    super(prisma.mention_targets, 'mention_targets', 'target_id');
  }

  async findOrCreateForPost(post_id: string): Promise<mention_targets> {
    const existing = await prisma.mention_targets.findFirst({ where: { post_id } });
    if (existing) return existing;
    return prisma.mention_targets.create({ data: { post: { connect: { content_id: post_id } } } });
  }

  async findOrCreateForComment(comment_id: string): Promise<mention_targets> {
    const existing = await prisma.mention_targets.findFirst({ where: { comment_id } });
    if (existing) return existing;
    return prisma.mention_targets.create({ data: { comment: { connect: { comment_id } } } });
  }

  async findByPost(post_id: string): Promise<mention_targets | null> {
    return prisma.mention_targets.findFirst({ where: { post_id }, include: { mentions: true } });
  }

  async findByComment(comment_id: string): Promise<mention_targets | null> {
    return prisma.mention_targets.findFirst({ where: { comment_id }, include: { mentions: true } });
  }
}
