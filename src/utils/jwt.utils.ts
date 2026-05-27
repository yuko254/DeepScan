import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 
import { UserAccountDto } from '../dtos/user.dto.js';
import { accessPayload, refreshPayload, AccessPayloadSchema, RefreshPayloadSchema } from '../validations/jwt.schema.js';
import * as env from '../config/env.js';

export function signAccessToken(payload: accessPayload) {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL_STRING } as jwt.SignOptions);
}

export function signRefreshToken(payload: refreshPayload, ttlSeconds: number) {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: ttlSeconds } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): accessPayload {
  const raw = jwt.verify(token, env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] });
  return AccessPayloadSchema.parse(raw);
}

export function verifyRefreshToken(token: string): refreshPayload {
  const raw = jwt.verify(token, env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] }) as refreshPayload;
  return RefreshPayloadSchema.parse(raw);
}

export function generateTokens(user: UserAccountDto, stayLoggedIn: boolean) {
  const jti = uuidv4(); // unique token ID

  const accessPayload: accessPayload = {
    user_id: user.user_id,
    username: user.username,
    role: user.role?.role_name,
  };

  const refreshPayload: refreshPayload = {
    user_id: user.user_id,
    jti: jti, // lookup key in Redis
  };

  const refreshTTLSeconds = stayLoggedIn
    ? 365 * 24 * 60 * 60   // 365 days
    : env.REFRESH_TOKEN_TTL_SECONDS;

  return {
    access_token: signAccessToken(accessPayload),
    refresh_token: signRefreshToken(refreshPayload, refreshTTLSeconds),
    jti: jti,
    refreshTTLSeconds
  };
}
