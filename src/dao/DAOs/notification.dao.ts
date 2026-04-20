import { Prisma, type notifications } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class NotificationDao extends BaseDao<
  notifications,
  Prisma.notificationsCreateInput,
  Prisma.notificationsUpdateInput,
  Prisma.notificationsWhereUniqueInput
> {
  constructor() {
    super(prisma.notifications);
  }

  async findByUser(user_id: string): Promise<notifications[]> {
    return prisma.notifications.findMany({
      where: { user_id },
      orderBy: { delivered_at: 'desc' },
    });
  }

  async findUnread(user_id: string): Promise<notifications[]> {
    return prisma.notifications.findMany({
      where: { user_id, read_at: null },
      orderBy: { delivered_at: 'desc' },
    });
  }

  async markAsRead(notification_id: string): Promise<notifications> {
    return prisma.notifications.update({
      where: { notification_id },
      data: { read_at: new Date() },
    });
  }

  async markAllAsRead(user_id: string): Promise<Prisma.BatchPayload> {
    return prisma.notifications.updateMany({
      where: { user_id, read_at: null },
      data: { read_at: new Date() },
    });
  }

  async getUnreadCount(user_id: string): Promise<number> {
    return prisma.notifications.count({ where: { user_id, read_at: null } });
  }
}
