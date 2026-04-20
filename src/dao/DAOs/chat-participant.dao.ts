import { Prisma, type chat_participants } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class ChatParticipantDao extends BaseDao<
  chat_participants,
  Prisma.chat_participantsCreateInput,
  Prisma.chat_participantsUpdateInput,
  Prisma.chat_participantsWhereUniqueInput
> {
  constructor() {
    super(prisma.chat_participants);
  }

  async findByChat(chat_id: string): Promise<chat_participants[]> {
    return prisma.chat_participants.findMany({
      where: { chat_id },
      include: { users: { include: { profiles: true } } },
    });
  }

  async findByUser(user_id: string): Promise<chat_participants[]> {
    return prisma.chat_participants.findMany({
      where: { user_id },
      include: { chats: true },
    });
  }

  async addParticipant(chat_id: string, user_id: string): Promise<chat_participants> {
    return prisma.chat_participants.create({
      data: {
        chats: { connect: { chat_id } },
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
