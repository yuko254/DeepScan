import { z } from 'zod';
import { RoleSchema } from "./users.dto.js";
import * as zod from "../validations/validation.js";


export const AccessPayloadSchema = z.strictObject({
  sub: zod.UUID,
  user_id: zod.UUID,
  username: z.string().min(1),
  role: RoleSchema.nullable().optional(),
});

export type accessPayload = z.infer<typeof AccessPayloadSchema>;

export const RefreshPayloadSchema = z.strictObject({
  user_id: zod.UUID,
  jti: zod.UUID,
});

export type refreshPayload = z.infer<typeof RefreshPayloadSchema>;
export type DecodedRefreshPayload = refreshPayload & { exp: number };