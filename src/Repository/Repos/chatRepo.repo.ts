import { type chats } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ChatRepo extends BaseRepository<typeof prisma.chats> {
  constructor() {
    super(prisma.chats, 'chats', 'chat_id');
  }

  async findByUser(user_id: string): Promise<chats[]> {
    return prisma.chats.findMany({
      where: { chat_participants: { some: { user_id } } },
      include: {
        chat_participants: { include: { user: { include: { profile: true } } } },
        messages: { orderBy: { sent_at: 'desc' }, take: 1 },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findWithParticipants(chat_id: string): Promise<chats | null> {
    return prisma.chats.findUnique({
      where: { chat_id },
      include: { chat_participants: { include: { user: { include: { profile: true } } } } },
    });
  }

  async createGroupChat(title: string, user_ids: string[]): Promise<chats> {
    return prisma.chats.create({
      data: {
        title,
        is_group_chat: true,
        chat_participants: {
          create: user_ids.map((user_id) => ({ user: { connect: { user_id } } })),
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
            { user: { connect: { user_id: user_id_a } } },
            { user: { connect: { user_id: user_id_b } } },
          ],
        },
      },
    });
  }

  /** Find the existing DM between exactly two users, if any */
  async findDirectChat(user_id_a: string, user_id_b: string): Promise<chats | null> {
    return prisma.chats.findFirst({
      where: {
        is_group_chat: false,
        chat_participants: { some: { user_id: user_id_a } },
        AND: { chat_participants: { some: { user_id: user_id_b } } },
      },
    });
  }

  async updateTitle(chat_id: string, title: string): Promise<chats> {
    return prisma.chats.update({ where: { chat_id }, data: { title } });
  }

  async deleteChat(chat_id: string): Promise<chats> {
    return prisma.chats.delete({ where: { chat_id } });
  }
}
