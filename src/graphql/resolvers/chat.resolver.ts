import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { chatService } from '../../services/chat.service.js';
import * as idSchema from '../../validations/id.schema.js';
import * as chatSchema from '../../validations/chat.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';

export const chatResolver: Resolvers = {
  Query: {
    myChats: async (_, __, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const chats = await chatService.getUserChats(context.user.user_id);
      return chats as any;
    },

    chat: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.id });
      const chat = await chatService.getChat(chat_id, context.user.user_id);
      return chat as any;
    },

    chatMessages: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
      const { cursor, limit } = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { messages, nextCursor } = await chatService.getChatMessages(
        chat_id,
        context.user.user_id,
        limit,
        cursor
      );
      return { messages: messages as any, nextCursor };
    },

    searchChatMessages: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
      const { search, cursor, limit } = querySchema.parse({ search: args.search, cursor: args.cursor, limit: args.limit });
      const { messages, totalCount, nextCursor } = await chatService.searchChatMessages(
        chat_id,
        context.user.user_id,
        search!,
        limit,
        cursor
      );
      return { messages: messages as any, totalCount, nextCursor };
    },
  },

  Mutation: {
    deleteChat: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
      await chatService.deleteChat(chat_id, context.user.user_id);
      return true;
    },

    sendMessage: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');

      const { target_user_id, text_content, reply_to } = chatSchema.SendMessageSchema.parse({
        target_user_id: args.input.targetUserId,
        text_content: args.input.text,
        reply_to: args.input.replyTo,
      });

      const message = await chatService.sendMessage(
        context.user.user_id,
        target_user_id,
        text_content,
        reply_to
      );

      const chatId = chatService.getChatId(context.user.user_id, target_user_id);
      context.pubsub.publish(`CHAT_${chatId}`, { messageSent: message });

      return message as any;
    },

    updateMessage: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = chatSchema.UpdateMessageSchema.parse({
        message_id: args.messageId,
        text_content: args.text,
      });

      const message = await chatService.updateMessage(
        context.user.user_id,
        input.message_id,
        input.text_content
      );

      context.pubsub.publish(`CHAT_${message!.chat_id}`, { messageUpdated: message });

      return message as any;
    },

    deleteMessage: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { message_id } = idSchema.MessageIdParamSchema.parse({ message_id: args.messageId });
      await chatService.deleteMessage(context.user.user_id, message_id);
      return true;
    },

    addReaction: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { message_id } = idSchema.MessageIdParamSchema.parse({ message_id: args.input.messageId });
      const input = chatSchema.AddReactionSchema.parse({
        message_id,
        emoji: args.input.emoji,
      });

      const reaction = await chatService.addReaction(
        context.user.user_id,
        input.message_id,
        input.emoji
      );

      const message = await chatService.getMessage(input.message_id);
      context.pubsub.publish(`CHAT_${message!.chat_id}`, { reactionAdded: reaction });

      return reaction as any;
    },

    removeReaction: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { message_id } = idSchema.MessageIdParamSchema.parse({ message_id: args.messageId });
      await chatService.removeReaction(context.user.user_id, message_id);
      return true;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_, args, context: GraphqlContext) => {
        if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
        const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
        return context.pubsub.asyncIterableIterator(`CHAT_${chat_id}`);
      },
    },
    messageUpdated: {
      subscribe: (_, args, context: GraphqlContext) => {
        if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
        const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
        return context.pubsub.asyncIterableIterator(`CHAT_${chat_id}`);
      },
    },
    reactionAdded: {
      subscribe: (_, args, context: GraphqlContext) => {
        if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
        const { chat_id } = idSchema.ChatIdParamSchema.parse({ chat_id: args.chatId });
        return context.pubsub.asyncIterableIterator(`CHAT_${chat_id}`);
      },
    },
  },

  chats: {
    last_message: (parent) => {
      const rawParent = parent as any;
      return rawParent.messages?.[0] || null;
    },
    unread_count: (parent, _, context: GraphqlContext) => {
      if (!context.user?.user_id) return 0;
      const rawParent = parent as any;
      const isUserA = rawParent.user_a === context.user.user_id;
      return isUserA ? rawParent.user_a_unread_count : rawParent.user_b_unread_count;
    },
  },

  messages: {
    reply_to: async (parent) => {
      const rawParent = parent as any;
      return rawParent.repliedMessage || null;
    },
    reactions: async (parent) => {
      const rawParent = parent as any;
      return rawParent.messageReactions || [];
    },
    is_mine: (parent, _, context: GraphqlContext) => {
      return parent.sender_id === context.user?.user_id;
    },
  },

  message_reactions: {
    is_mine: (parent, _, context: GraphqlContext) => {
      return parent.user_id === context.user?.user_id;
    },
  },
};