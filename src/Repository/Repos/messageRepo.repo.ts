import { type messages } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MessageRepo extends BaseRepository<typeof prisma.messages> {
  constructor() {
    super(prisma.messages, 'messages', 'message_id');
  }

  async findByChat(chat_id: string, take = 50, cursor?: string) {
    return this.model.findMany({
      where: { chat_id },
      orderBy: { sent_at: 'desc' },
      take,
      ...(cursor && { skip: 1, cursor: { message_id: cursor } }),
    });
  }

  async send(chat_id: string, sender_id: string, text_content: string) {
    return this.model.create({
      data: {
        chat: { connect: { chat_id } },
        user: { connect: { user_id: sender_id } }, // fix: was 'users'
        text_content,
      },
    });
  }

  async getLastMessage(chat_id: string) {
    return this.model.findFirst({
      where: { chat_id },
      orderBy: { sent_at: 'desc' },
    });
  }

  async deleteMessage(message_id: string) {
    return this.model.delete({ where: { message_id } });
  }
}
