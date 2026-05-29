import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MessageReactionRepo extends BaseRepository<typeof prisma.message_reactions> {
  constructor() {
    super(prisma.message_reactions, 'message_reactions', 'reaction_id');
  }

  async addReaction(message_id: string, user_id: string, emoji: string) {
    return this.model.upsert({
      where: {
        message_id_user_id: {
          message_id,
          user_id,
        },
      },
      update: {
        emoji,
        created_at: new Date(),
      },
      create: {
        message_id,
        user_id,
        emoji,
      },
    });
  }

  async removeReaction(message_id: string, user_id: string) {
    return this.model.delete({
      where: {
        message_id_user_id: {
          message_id,
          user_id,
        },
      },
    });
  }

  async findByMessage(message_id: string) {
    return this.model.findMany({
      where: { message_id },
      include: {
        user: { include: { profile: true } },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async getReactionCount(message_id: string, emoji?: string) {
    const where: any = { message_id };
    if (emoji) where.emoji = emoji;

    return this.model.count({ where });
  }
}