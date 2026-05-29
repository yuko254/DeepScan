import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MessageRepo extends BaseRepository<typeof prisma.messages> {
  constructor() {
    super(prisma.messages, 'messages', 'message_id');
  }

  async findMessage(message_id: string) {
    return this.model.findUnique({
      where: { message_id },
      include: {
        sender: { include: { profile: true } },
        repliedMessage: true,
        messageReactions: true,
      },
    });
  }

  async findMessageWithChat(message_id: string) {
    return this.model.findUnique({
      where: { message_id },
      include: { chat: true },
    });
  }

  async findByChat(chat_id: string, limit: number, cursor?: Date) {
    const where: Prisma.messagesWhereInput = {
      chat_id,
      ...(cursor && { sent_at: { lt: cursor } }),
    };

    const messages = await this.model.findMany({
      take: limit,
      where,
      orderBy: { sent_at: 'desc' },
      include: {
        repliedMessage: true,
        messageReactions: true,
      },
    });

    const nextCursor = messages.length === limit
      ? messages[messages.length - 1]?.sent_at
      : null;

    return { messages, nextCursor };
  }

  async getReplyCount(message_id: string) {
    return this.model.count({
      where: { reply_to: message_id, deleted_at: null },
    });
  }

  async send(chat_id: string, sender_id: string, text_content: string, reply_to?: string) {
    return this.model.create({
      data: {
        chat_id,
        sender_id,
        text_content,
        reply_to,
      }
    });
  }

  async updateMessage(message_id: string, user_id: string, text_content: string) {
    return this.model.update({
      where: {
        message_id,
        sender_id: user_id,
      },
      data: { text_content },
    });
  }
  
  async softDelete(message_id: string, user_id: string) {
    return this.model.update({
      where: {
        message_id,
        sender_id: user_id,
      },
      data: { deleted_at: new Date(), text_content: "deleted" },
    });
  }

  async searchChat(chat_id: string, searchQuery: string, limit: number, cursor?: Date) {
    const where: Prisma.messagesWhereInput = {
      chat_id,
      deleted_at: null,
      text_content: {
        contains: searchQuery,
        mode: Prisma.QueryMode.insensitive,
      },
      ...(cursor && { sent_at: { lt: cursor } }),
    };

    const [messages, totalCount] = await Promise.all([
      this.model.findMany({
        take: limit,
        where,
        orderBy: { sent_at: 'desc' },
      }),
      this.model.count({ where }),
    ]);

    const nextCursor = messages.length === limit
      ? messages[messages.length - 1]?.sent_at
      : null;

    return { messages, totalCount, nextCursor };
  }
}