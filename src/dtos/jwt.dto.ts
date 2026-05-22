import { z } from 'zod';
import { RoleSchema } from "./users.dto.js";
import * as zod from "../validations/validation.js";


export const AccessPayloadSchema = z.strictObject({
  user_id: zod.byId.uuid('userId'),
  username: z.string().min(1),
  role: RoleSchema.nullable().optional(),
});

export type accessPayload = z.infer<typeof AccessPayloadSchema>;

export const RefreshPayloadSchema = z.strictObject({
  user_id: zod.byId.uuid('userId'),
  jti: zod.byId.uuid('jti'),
});

export type refreshPayload = z.infer<typeof RefreshPayloadSchema>;
export type DecodedRefreshPayload = refreshPayload & { sub: string, exp: number };