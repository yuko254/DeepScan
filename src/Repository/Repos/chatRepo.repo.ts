import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ChatRepo extends BaseRepository<typeof prisma.chats> {
  constructor() {
    super(prisma.chats, 'chats', 'chat_id');
  }

  getChatId(user_a: string, user_b: string): string {
    const [first, second] = [user_a, user_b].sort();
    return `${first}_${second}`;
  }

  async findChat(chat_id: string) {
    return this.model.findUnique({
      where: { chat_id },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
      },
    });
  }

  async findChatByUsers(user_a: string, user_b: string) {
    const chat_id = this.getChatId(user_a, user_b);
    return this.findChat(chat_id);
  }

  async findUserChats(user_id: string) {
    const chats = await this.model.findMany({
      where: {
        OR: [
          { user_a: user_id },
          { user_b: user_id },
        ],
      },
      include: {
        userA: { include: { profile: true } },
        userB: { include: { profile: true } },
        messages: {
          orderBy: { sent_at: 'desc' },
          take: 1,
        },
      },
      orderBy: { updated_at: 'desc' },
    });

    return chats;
  }

  async isParticipant(chat_id: string, user_id: string) {
    const chat = await this.model.findFirst({
      where: {
        chat_id,
        OR: [
          { user_a: user_id },
          { user_b: user_id },
        ],
      },
      select: { chat_id: true },
    });
    return !!chat;
  }

  async createChat(user_a: string, user_b: string) {
    const chat_id = this.getChatId(user_a, user_b);
    return this.model.create({
      data: {
        chat_id,
        user_a,
        user_b,
      },
    });
  }

  async deleteChat(chat_id: string) {
    return this.model.delete({
      where: { chat_id },
    });
  }

  async incrementUnreadCount(chat_id: string, field: 'user_a_unread_count' | 'user_b_unread_count') {
    return this.model.update({
      where: { chat_id },
      data: { [field]: { increment: 1 } },
    });
  }

  async updateField(chat_id: string, field: string, value: number) {
    return this.model.update({
      where: { chat_id },
      data: { [field]: value },
    });
  }
}