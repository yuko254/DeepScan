import { z } from 'zod';
import { IdSchema } from "./fields/common.fields.js"
import * as user from "./fields/user.fields.js"

// ─── JWT payloads ───
export const AccessPayloadSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
  username: z.string().min(1),
  role: user.roleNameField.nullish(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const RefreshPayloadSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
  jti: IdSchema.uuid('jti'),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// ─── Types ───
export type refreshPayload = z.infer<typeof RefreshPayloadSchema>;
export type accessPayload = z.infer<typeof AccessPayloadSchema>;