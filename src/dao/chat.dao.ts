import { Prisma, type chats } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class ChatDao extends BaseDao<
  chats,
  Prisma.chatsCreateInput,
  Prisma.chatsUpdateInput,
  Prisma.chatsWhereUniqueInput
> {
  constructor() {
    super(prisma.chats);
  }

  async findByUser(user_id: string): Promise<chats[]> {
    return prisma.chats.findMany({
      where: { chat_participants: { some: { user_id } } },
      include: { chat_participants: true, messages: { orderBy: { sent_at: 'desc' }, take: 1 } },
      orderBy: { created_at: 'desc' },
    });
  }

  async findWithParticipants(chat_id: string): Promise<chats | null> {
    return prisma.chats.findUnique({
      where: { chat_id },
      include: { chat_participants: { include: { users: { include: { profiles: true } } } } },
    });
  }

  async createGroupChat(title: string, user_ids: string[]): Promise<chats> {
    return prisma.chats.create({
      data: {
        title,
        is_group_chat: true,
        chat_participants: {
          create: user_ids.map((user_id) => ({ users: { connect: { user_id } } })),
        },
      },
    });
  }

  async createDirectChat(user_id_a: string, user_id_b: string): Promise<chats> {
    return prisma.chats.create({
      data: {
        is_group_chat: false,
        chat_participants: {
          create: [
            { users: { connect: { user_id: user_id_a } } },
            { users: { connect: { user_id: user_id_b } } },
          ],
        },
      },
    });
  }
}
