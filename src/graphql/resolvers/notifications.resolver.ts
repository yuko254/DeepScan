import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { notificationService } from '../../services/notification.service.js';
import * as idSchema from '../../validations/id.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';

export const notificationsResolver: Resolvers = {
  Query: {
    notification: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { notification_id } = idSchema.NotificationIdParamSchema.parse({ notification_id: args.id });
      const notification = await notificationService.getNotification(context.user.user_id, notification_id);
      return notification as any;
    },

    notifications: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { notifications, nextCursor } = await notificationService.getUserNotifications(context.user.user_id, input.limit, input.cursor);
      return { notifications: notifications as any, nextCursor };
    },
  },

  Mutation: {
    markNotificationRead: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { notification_id } = idSchema.NotificationIdParamSchema.parse({ notification_id: args.notificationId });
      await notificationService.getNotification(context.user.user_id, notification_id);
      await notificationService.markAsRead(notification_id);
      return true;
    },
  },
};