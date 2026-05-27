import { notifications, NotificationType } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class NotificationRepo extends BaseRepository<typeof prisma.notifications> {
  constructor() {
    super(prisma.notifications, 'notifications', 'notification_id');
  }

  async findUserNotificationsPage(user_id: string, limit = 30, cursor?: string) {
    const notifications = await this.model.findMany({
      where: {
        user_id,
        ...(cursor && { notification_id: { lt: cursor } })
      },
      include: {
        actor: { include: { profile: true } },
        notification_target: true
      },
      orderBy: { delivered_at: 'desc' },
      take: limit + 1
    });

    const hasMore = notifications.length > limit;
    const pageNotifications = hasMore ? notifications.slice(0, limit) : notifications;
    const nextCursor = hasMore ? pageNotifications[pageNotifications.length - 1]?.notification_id : null;

    return { notifications: pageNotifications, nextCursor, hasMore };
  }

  async markAsRead(notification_id: string) {
    return this.model.update({
      where: { notification_id },
      data: { read_at: new Date() },
    });
  }

  async deleteOld(before: Date) {
    return this.model.deleteMany({ where: { delivered_at: { lt: before } } });
  }
}
