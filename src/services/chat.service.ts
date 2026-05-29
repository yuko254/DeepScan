import { Prisma, prisma } from '../config/prisma.js';
import { chatRepo, messageRepo, messageReactionRepo } from '../Repository/instances.js';
import * as AppError from '../types/appErrors.types.js';

class ChatService {
  // Helper: Generate deterministic chat ID
  getChatId(user_a: string, user_b: string): string {
    return chatRepo.getChatId(user_a, user_b);
  }

  private async incrementUnreadCount(user_id: string, chat_id: string) {
    try {
      const [user_a, user_b] = chat_id.split('_');

      const isUserA = user_id === user_a;
      const recipientId = isUserA ? user_b : user_a;
      const incrementField = isUserA ? 'user_b_unread_count' : 'user_a_unread_count';

      await chatRepo.incrementUnreadCount(chat_id, incrementField);

      // Also trigger notification for recipient if needed
      // await notificationService.send(...)
    } catch (error) {
      console.error('Failed to update unread count:', error);
    }
  }

  private async markChatAsRead(user_id: string, chat_id: string) {
    const [user_a, user_b] = chat_id.split('_');

    // Verify user is participant
    if (user_id !== user_a && user_id !== user_b) return;

    const isUserA = user_id === user_a;
    const field = isUserA ? 'user_a_unread_count' : 'user_b_unread_count';

    await chatRepo.updateField(chat_id, field, 0);
  }

  // ─── Queries ─────────────────────────────────────────────────────────────

  async getUserChats(user_id: string) {
    const chats = await chatRepo.findUserChats(user_id);

    return chats.map(chat => ({
      ...chat,
      other_user: chat.user_a === user_id ? chat.userB : chat.userA,
    }));
  }

  async getChat(chat_id: string, user_id: string) {
    const chat = await chatRepo.findChat(chat_id);
    if (!chat) throw new AppError.NotFoundError('Chat not found');
    if (chat.user_a !== user_id && chat.user_b !== user_id)
      throw new AppError.ForbiddenError('You are not a participant of this chat');

    return {
      ...chat,
      other_user: chat.user_a === user_id ? chat.userB : chat.userA,
    };
  }

  async getMessage(message_id: string) {
    return messageRepo.findMessage(message_id);
  }

  async getChatMessages(chat_id: string, user_id: string, limit: number, cursor?: Date) {
    const { messages, nextCursor } = await messageRepo.findByChat(chat_id, limit, cursor);

    let senderIds = [...new Set(messages.map(m => m.sender_id))];
    if (senderIds.length < 2) {
      const chat = await chatRepo.findChat(chat_id);
      if (!chat) throw new AppError.NotFoundError('Chat not found');
      const isParticipant = (user_id === chat.user_a) || (user_id === chat.user_b);
      if (!isParticipant) throw new AppError.ForbiddenError('You are not a participant of this chat');
    } else if (!senderIds.includes(user_id)) {
      throw new AppError.ForbiddenError('You are not a participant of this chat');
    }

    this.markChatAsRead(user_id, chat_id).catch(console.error);

    return { messages, nextCursor };
  }

  async searchChatMessages(chat_id: string, user_id: string, search: string, limit: number, cursor?: Date) {
    const { messages, totalCount, nextCursor } = await messageRepo.searchChat(chat_id, search, limit, cursor);

    const senderIds = [...new Set(messages.map(m => m.sender_id))];
    if (senderIds.length < 2) {
      const chat = await chatRepo.findChat(chat_id);
      if (!chat) throw new AppError.NotFoundError('Chat not found');
      const isParticipant = (user_id === chat.user_a) || (user_id === chat.user_b);
      if (!isParticipant) throw new AppError.ForbiddenError('You are not a participant of this chat');
    } else if (!senderIds.includes(user_id)) {
      throw new AppError.ForbiddenError('You are not a participant of this chat');
    }

    return { messages, totalCount, nextCursor };
  }

  // ─── Chat Mutations ─────────────────────────────────────────────────────

  async deleteChat(chat_id: string, user_id: string) {
    const isParticipant = await chatRepo.isParticipant(chat_id, user_id);
    if (!isParticipant)
      throw new AppError.ForbiddenError('You are not a participant of this chat');

    await chatRepo.deleteChat(chat_id);
    return true;
  }

  // ─── Message Mutations ─────────────────────────────────────────────────

  async sendMessage(user_id: string, target_user_id: string, text_content: string, reply_to?: string) {
    if (user_id === target_user_id)
      throw new AppError.ValidationError('Cannot send a message to yourself');

    const chat_id = this.getChatId(user_id, target_user_id);

    const message = await messageRepo.send(chat_id, user_id, text_content, reply_to).catch(async (e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          await chatRepo.createChat(user_id, target_user_id);
          return await messageRepo.send(chat_id, user_id, text_content, reply_to);
        }
        throw e;
      }
    });

    this.incrementUnreadCount(user_id, chat_id).catch(console.error);

    return message;
  }

  async updateMessage(user_id: string, message_id: string, text_content: string) {
    return messageRepo.updateMessage(message_id, user_id, text_content)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025')
            throw new AppError.ForbiddenError('You either tried to update a non-existing message or dont have permission to update it');
          throw e;
        }
      });
  }

  async deleteMessage(user_id: string, message_id: string) {
    await messageRepo.softDelete(message_id, user_id)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025')
            throw new AppError.ForbiddenError('You either tried to delete a non existing message or dont have permission to delete it');
          throw e;
        }
      });
    return true;
  }

  // ─── Reaction Mutations ────────────────────────────────────────────────

  async addReaction(user_id: string, message_id: string, emoji: string) {
    const message = await messageRepo.findMessageWithChat(message_id);
    if (!message) throw new AppError.NotFoundError('Message not found');

    if (message.chat.user_a !== user_id && message.chat.user_b !== user_id)
      throw new AppError.ForbiddenError('You are not a participant of this chat');

    return messageReactionRepo.addReaction(message_id, user_id, emoji);
  }

  async removeReaction(user_id: string, message_id: string) {
    const message = await messageRepo.findMessageWithChat(message_id);
    if (!message) throw new AppError.NotFoundError('Message not found');

    if (message.chat.user_a !== user_id && message.chat.user_b !== user_id)
      throw new AppError.ForbiddenError('You are not a participant of this chat');

    await messageReactionRepo.removeReaction(message_id, user_id);
    return true;
  }
}

export const chatService = new ChatService();