import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 
import type { TokensDto } from '../dtos/auth.dto.js';
import type { UserAccountDto } from '../dtos/users.dto.js';
import { type accessPayload, type refreshPayload, AccessPayloadSchema, RefreshPayloadSchema } from '../dtos/dto.js';
import * as env from '../config/env.js';

export function signAccessToken(payload: accessPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL_STRING } as jwt.SignOptions);
}

export function signRefreshToken(payload: refreshPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL_STRING } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): accessPayload {
  const raw = jwt.verify(token, env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
  return AccessPayloadSchema.parse(raw);
}

export function verifyRefreshToken(token: string): refreshPayload {
  const raw = jwt.verify(token, env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] }) as refreshPayload;
  return RefreshPayloadSchema.parse(raw);
}

export function generateTokens(user: UserAccountDto): TokensDto {
  const jti = uuidv4(); // unique token ID

  const accessPayload: accessPayload = {
    sub: user.user_id,
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  };

  const refreshPayload: refreshPayload = {
    user_id: user.user_id,
    jti: jti, // lookup key in Redis
  };

  return {
    access_token: signAccessToken(accessPayload),
    refresh_token: signRefreshToken(refreshPayload),
    jti: jti
  };
}
