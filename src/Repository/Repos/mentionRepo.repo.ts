import { Prisma, type mentions } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MentionRepo extends BaseRepository<
  typeof prisma.mentions
> {
  constructor() {
    super(prisma.mentions, 'mentions', 'mention_id');
  }

  async findByUser(mentioned_user_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({
      where: { mentioned_user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByPost(post_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({ where: { post_id } });
  }

  async findByComment(comment_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({ where: { comment_id } });
  }
}
