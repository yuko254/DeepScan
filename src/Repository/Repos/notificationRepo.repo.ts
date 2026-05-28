import { notifications, NotificationType } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class NotificationRepo extends BaseRepository<typeof prisma.notifications> {
  constructor() {
    super(prisma.notifications, 'notifications', 'notification_id');
  }

  async findNotification(notification_id: string) {
    return this.model.findUnique({
      where: { notification_id },
      include: {
        actor: { include: { profile: true } },
        notification_target: true
      },
    });
  }

  async findUserNotifications(user_id: string, limit: number, cursor?: Date) {
    const where: Prisma.notificationsWhereInput = {
      user_id,
      ...(cursor && { delivered_at: { lt: cursor } })
    };

    const notifications = await this.model.findMany({
      take: limit,
      where,
      include: {
        actor: { include: { profile: true } },
        notification_target: true
      },
      orderBy: { delivered_at: 'desc' },
    });

    const nextCursor = notifications.length === limit
      ? notifications[notifications.length - 1]?.delivered_at
      : null;

    return { notifications, nextCursor };
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
