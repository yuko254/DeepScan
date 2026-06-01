import { verifyAccessToken } from './jwt.utils.js';
import { accessPayload } from '../validations/jwt.schema.js';

export function extractToken(source: any): string | null {
  const isWebSocket = source.connectionParams !== undefined || source.extra !== undefined;

  if (isWebSocket) {
    const raw = source.connectionParams?.authorization as string | undefined;
    if (raw?.startsWith('Bearer ')) return raw.slice(7);

    const cookieHeader = source.extra?.request?.headers?.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/);
      if (match) return match[1]!;
    }

    const headerAuth = source.extra?.request?.headers?.authorization;
    if (headerAuth?.startsWith('Bearer ')) return headerAuth.slice(7);
  }
  else {
    let token = source.cookies?.access_token;
    if (token) return token;

    const authHeader = source.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  }

  return null;
}

export function extractAndVerifyToken(source: any): accessPayload | null {
  const token = extractToken(source);
  if (!token) return null;

  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}