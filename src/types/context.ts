import type { PrismaClient } from '@prisma/client';
import type { Users } from '../graphql/graphql.js';

export interface Context {
  user: Users | null;
  prisma: PrismaClient;
}