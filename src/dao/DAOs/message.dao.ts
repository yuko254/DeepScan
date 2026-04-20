import { Prisma, type messages } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class MessageDao extends BaseDao<
  messages,
  Prisma.messagesCreateInput,
  Prisma.messagesUpdateInput,
  Prisma.messagesWhereUniqueInput
> {
  constructor() {
    super(prisma.messages);
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
        chats: { connect: { chat_id } },
        users: { connect: { user_id: sender_id } },
        text_content,
      },
    });
  }
}
