import { Prisma, NotificationType } from '@prisma/client';
import { notificationRepo, notificationTargetRepo } from '../Repository/instances.js';
import * as AppError from '../types/appErrors.types.js';

type SendInput = {
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  message: string;
};

class NotificationService {

  // ─── User-facing queries ───────────────────────────────────────────────────

  async getNotification(user_id: string, notification_id: string) {
    const notification = await notificationRepo.findNotification(notification_id);
    if (!notification) throw new AppError.NotFoundError('Notification not found');
    if (user_id !== notification.user_id) throw new AppError.ForbiddenError('you cant view this notification');
    return notification;
  }

  async getUserNotifications(user_id: string, limit: number, cursor?: Date,) {
    return notificationRepo.findUserNotifications(user_id, limit, cursor);
  }

  async markAsRead(notification_id: string) {
    return notificationRepo.markAsRead(notification_id);
  }

  async deleteOld(before: Date) {
    return notificationRepo.deleteOld(before);
  }

  // ─── Send helpers ─────────────────────────────────────────────────────────

  async send(input: SendInput, tx?: Prisma.TransactionClient) {
    return notificationRepo.withTx(tx).create({ data: input });
  }

  async sendForPost(input: SendInput, post_id: string, tx?: Prisma.TransactionClient) {
    const target = await notificationTargetRepo.withTx(tx).findOrCreateForPost(post_id);
    return notificationRepo.withTx(tx).create({
      data: { ...input, notification_target_id: target.target_id },
    });
  }

  async sendForPostSafe(input: SendInput, post_id: string, tx?: Prisma.TransactionClient) {
    const target = await notificationTargetRepo.withTx(tx).findOrCreateForPost(post_id).catch(() => null);
    return notificationRepo.withTx(tx).create({
      data: { ...input, notification_target_id: target?.target_id ?? null },
    });
  }

  async sendForComment(input: SendInput, comment_id: string, tx?: Prisma.TransactionClient) {
    const target = await notificationTargetRepo.withTx(tx).findOrCreateForComment(comment_id);
    return notificationRepo.withTx(tx).create({
      data: { ...input, notification_target_id: target.target_id },
    });
  }

  async sendForChat(input: SendInput, chat_id: string, tx?: Prisma.TransactionClient) {
    const target = await notificationTargetRepo.withTx(tx).findOrCreateForChat(chat_id);
    return notificationRepo.withTx(tx).create({
      data: { ...input, notification_target_id: target.target_id },
    });
  }
}

export const notificationService = new NotificationService();