import { Prisma, type chat_participants } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ChatParticipantRepo extends BaseRepository<
  typeof prisma.chat_participants
> {
  constructor() {
    super(prisma.chat_participants, 'chat_participants');
  }

  async findByChat(chat_id: string): Promise<chat_participants[]> {
    return prisma.chat_participants.findMany({
      where: { chat_id },
      include: { user: { include: { profile: true } } },
    });
  }

  async findByUser(user_id: string): Promise<chat_participants[]> {
    return prisma.chat_participants.findMany({
      where: { user_id },
      include: { chat: true },
    });
  }

  async addParticipant(chat_id: string, user_id: string): Promise<chat_participants> {
    return prisma.chat_participants.create({
      data: {
        chat: { connect: { chat_id } },
        users: { connect: { user_id } },
      },
    });
  }

  async removeParticipant(chat_id: string, user_id: string): Promise<chat_participants> {
    return prisma.chat_participants.delete({
      where: { user_id_chat_id: { user_id, chat_id } },
    });
  }

  async isParticipant(chat_id: string, user_id: string): Promise<boolean> {
    const p = await prisma.chat_participants.findUnique({
      where: { user_id_chat_id: { user_id, chat_id } },
    });
    return p !== null;
  }
}
