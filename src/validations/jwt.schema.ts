import { z } from 'zod';
import { IdSchema } from "./fields/common.fields.js"
import * as user from "./fields/user.fields.js"

// ─── JWT payloads ───
export const AccessPayloadSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
  username: z.string().min(1),
  role: user.roleNameField.nullish(),
});

export const RefreshPayloadSchema = z.strictObject({
  user_id: IdSchema.uuid('userId'),
  jti: IdSchema.uuid('jti'),
});

// ─── Types ───
export type refreshPayload = z.infer<typeof RefreshPayloadSchema>;
export type accessPayload = z.infer<typeof AccessPayloadSchema>;

export type DecodedRefreshPayload = refreshPayload & { sub: string, exp: number };