import { type notifications, NotificationType, Prisma } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class NotificationRepo extends BaseRepository<typeof prisma.notifications> {
  constructor() {
    super(prisma.notifications, 'notifications', 'notification_id');
  }

  async findByUser(user_id: string, take = 30) {
    return this.model.findMany({
      where: { user_id },
      include: { actor: { include: { profile: true } }, notification_target: true },
      orderBy: { delivered_at: 'desc' },
      take,
    });
  }

  async findUnread(user_id: string) {
    return this.model.findMany({
      where: { user_id, read_at: null },
      include: { actor: { include: { profile: true } } },
      orderBy: { delivered_at: 'desc' },
    });
  }

  async markAsRead(notification_id: string) {
    return this.model.update({
      where: { notification_id },
      data: { read_at: new Date() },
    });
  }

  async markAllAsRead(user_id: string) {
    return this.model.updateMany({
      where: { user_id, read_at: null },
      data: { read_at: new Date() },
    });
  }

  async getUnreadCount(user_id: string) {
    return this.model.count({ where: { user_id, read_at: null } });
  }

  async deleteOld(before: Date) {
    return this.model.deleteMany({ where: { delivered_at: { lt: before } } });
  }
}
