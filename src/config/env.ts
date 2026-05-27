// APP configuration
export const ClientOrigin = process.env.Client || 'http://localhost:5173';
export const APP_NAME = process.env.APP_NAME || 'DeepScan';
export const APP_HOST = process.env.HOST || 'localhost';
export const APP_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
export const APP_URL = `http://${APP_HOST}:${APP_PORT}`;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL!;

// Redis configuration
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD!;

// MinIO configuration
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'localhost';
export const MINIO_PORT = process.env.MINIO_PORT ? parseInt(process.env.MINIO_PORT, 10) : 9000;
export const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true';
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin123';
export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'deepscan';

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

// Security
export const SALT_ROUNDS = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 12;
export const PASSWORD_RESET_TOKEN_IN_SECONDS = process.env.PASSWORD_RESET_TOKEN_IN_SECONDS ? parseInt(process.env.PASSWORD_RESET_TOKEN_IN_SECONDS, 10) : 1800;