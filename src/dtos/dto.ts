import type { PrismaClient } from '@prisma/client';
import { Decimal } from "@prisma/client/runtime/client";
import type { RoleDto } from "./users.dto.js";

export interface PageDto {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface accessPayload {
  user_id: string;
  username: string;
  role: RoleDto | null | undefined;
}

export interface refreshPayload {
  user_id: string;
  jti: string;
}

export interface GraphqlContext {
  user: accessPayload | undefined | null;
  prisma: PrismaClient;
}

type RemoveUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K]
};

export function deepClean<T extends Record<string, any>>(obj: T): RemoveUndefined<T> {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(deepClean) as unknown as T;
  }

  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof Decimal)) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleaned = deepClean(value);
      if (cleaned !== undefined) {  // keep null, strip only undefined
        result[key] = cleaned;
      }
    }
    return result as T;
  }

  return obj;
}