import { type chat_participants } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ChatParticipantRepo extends BaseRepository<typeof prisma.chat_participants> {
  constructor() {
    super(prisma.chat_participants, 'chat_participants');
  }

  async findByChat(chat_id: string) {
    return this.model.findMany({
      where: { chat_id },
      include: { user: { include: { profile: true } } },
    });
  }

  async findByUser(user_id: string) {
    return this.model.findMany({
      where: { user_id },
      include: { chat: true },
    });
  }

  async addParticipant(chat_id: string, user_id: string) {
    return this.model.create({
      data: {
        chat: { connect: { chat_id } },
        user: { connect: { user_id } },
      },
    });
  }

  async removeParticipant(chat_id: string, user_id: string) {
    return this.model.delete({
      where: { user_id_chat_id: { user_id, chat_id } },
    });
  }

  async isParticipant(chat_id: string, user_id: string) {
    const p = await this.model.findFirst({
      where: { user_id, chat_id },
    });
    return p !== null;
  }

  async getParticipantCount(chat_id: string) {
    return this.model.count({ where: { chat_id } });
  }
}
