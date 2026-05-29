import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';

// ─── Message ───
export const SendMessageSchema = z.strictObject({
  target_user_id: IdSchema.uuid('targetUserId'),
  text_content: z.string().min(1).max(5000),
  reply_to: IdSchema.uuid('messageId').optional(),
});

export const UpdateMessageSchema = z.strictObject({
  message_id: IdSchema.uuid('messageId'),
  text_content: z.string().min(1).max(5000),
});

// ─── Message Reactions ───
export const AddReactionSchema = z.strictObject({
  message_id: IdSchema.uuid('messageId'),
  emoji: z.string().min(1).max(10),
});

// ─── Types ───
export type SendMessage = z.infer<typeof SendMessageSchema>;
export type UpdateMessage = z.infer<typeof UpdateMessageSchema>;

export type AddReaction = z.infer<typeof AddReactionSchema>;