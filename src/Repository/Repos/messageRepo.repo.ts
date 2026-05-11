import { Prisma, type messages } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MessageRepo extends BaseRepository<
  typeof prisma.messages
> {
  constructor() {
    super(prisma.messages, 'messages', 'message_id');
  }

  async findByChat(chat_id: string, take = 50, cursor?: string): Promise<messages[]> {
    return prisma.messages.findMany({
      where: { chat_id },
      orderBy: { sent_at: 'desc' },
      take,
      ...(cursor && { skip: 1, cursor: { message_id: cursor } }),
    });
  }

  async send(chat_id: string, sender_id: string, text_content: string): Promise<messages> {
    return prisma.messages.create({
      data: {
        chat: { connect: { chat_id } },
        users: { connect: { user_id: sender_id } },
        text_content,
      },
    });
  }
}
