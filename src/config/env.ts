// APP configuration
export const APP_NAME = process.env.APP_NAME || 'DeepScan';
export const APP_HOST = process.env.HOST || 'localhost';
export const APP_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
export const APP_URL = `http://${APP_HOST}:${APP_PORT}`;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const ClientOrigin = process.env.Client || 'http://localhost:5173';

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL!;

// Redis configuration
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;

// JWT configuration
export const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
export const ACCESS_TOKEN_TTL_STRING = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
const parsedAccess = parseDurationToSeconds(ACCESS_TOKEN_TTL_STRING);
export const ACCESS_TOKEN_TTL_SECONDS = parsedAccess !== null ? parsedAccess : 900;        // default 15 min
export const ACCESS_TOKEN_TTL_MS = ACCESS_TOKEN_TTL_SECONDS * 1000;

export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
export const REFRESH_TOKEN_TTL_STRING = process.env.JWT_REFRESH_EXPIRES_IN ?? '7d';
const parsedRefresh = parseDurationToSeconds(REFRESH_TOKEN_TTL_STRING);
export const REFRESH_TOKEN_TTL_SECONDS = parsedRefresh !== null ? parsedRefresh : 604800;   // default 7 days
export const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_SECONDS * 1000;

function parseDurationToSeconds(duration: string): number | null {
  const match = duration.match(/^(\d+)\s*(d|h|m|s)$/i);
  if (!match) return null;

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!.toLowerCase();

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default:  return null;
  }
}

// Other
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 12;
export const PASSWORD_RESET_TOKEN_IN_MIN = process.env.PASSWORD_RESET_TOKEN_IN_MIN ? parseInt(process.env.PASSWORD_RESET_TOKEN_IN_MIN, 10) : 30;