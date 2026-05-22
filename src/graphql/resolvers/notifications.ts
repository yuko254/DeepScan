import type { Resolvers, QueryNotificationArgs, Users } from '../graphql.js';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import { NotificationService } from '../../services/notification.service.js';

type GraphQLContext = { req: Request; user?: Users | null; prisma: PrismaClient };

const notificationService = new NotificationService();

export const notificationResolvers: Partial<Resolvers<GraphQLContext>> = {
  Query: {
    notifications: async (_parent, _args, ctx) => {
      const userId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await notificationService.getNotifications(userId as string);
    },
    notification: async (_parent, args: QueryNotificationArgs, _ctx) => {
      return await notificationService.getNotification(args.id);
    },
  },
  Mutation: {},
  notifications: {},
};