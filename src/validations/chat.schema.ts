import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';

// ─── Chat ───
export const ChatCreateSchema = z.strictObject({
  title: z.string().max(255).nullish(),
  is_group_chat: z.boolean().default(false),
  participant_ids: z.array(IdSchema.uuid('userId')).min(1),
});

export const ChatUpdateSchema = z.strictObject({
  chat_id: IdSchema.uuid('chatId'),
  title: z.string().max(255).nullish(),
});

// ─── Message ───
export const MessageCreateSchema = z.strictObject({
  chat_id: IdSchema.uuid('chatId'),
  text_content: z.string().min(1).max(5000),
});

export const MessageUpdateSchema = z.strictObject({
  message_id: IdSchema.uuid('messageId'),
  text_content: z.string().min(1).max(5000),
});

// ─── Chat Participant ───
export const ChatParticipantAddSchema = z.strictObject({
  chat_id: IdSchema.uuid('chatId'),
  user_id: IdSchema.uuid('userId'),
});

// ─── ID Params ───
export const ChatIdParamSchema = z.strictObject({
  chat_id: IdSchema.uuid('chatId'),
});

export const MessageIdParamSchema = z.strictObject({
  message_id: IdSchema.uuid('messageId'),
});

// ─── Types ───
export type ChatCreate = z.infer<typeof ChatCreateSchema>;
export type ChatUpdate = z.infer<typeof ChatUpdateSchema>;

export type MessageCreate = z.infer<typeof MessageCreateSchema>;
export type MessageUpdate = z.infer<typeof MessageUpdateSchema>;

export type ChatParticipantAdd = z.infer<typeof ChatParticipantAddSchema>;