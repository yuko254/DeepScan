import { type mentions } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MentionRepo extends BaseRepository<typeof prisma.mentions> {
  constructor() {
    super(prisma.mentions, 'mentions', 'mention_id');
  }

  async findByUser(mentioned_user_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({
      where: { mentioned_user_id },
      include: { mention_target: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByTarget(mention_target_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({
      where: { mention_target_id },
      include: { user: { include: { profile: true } } },
    });
  }

  async createMention(mentioned_user_id: string, mention_target_id: string): Promise<mentions> {
    return prisma.mentions.create({
      data: {
        user: { connect: { user_id: mentioned_user_id } },
        mention_target: { connect: { target_id: mention_target_id } },
      },
    });
  }
}
