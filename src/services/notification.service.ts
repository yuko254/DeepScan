import { Prisma, NotificationType } from '@prisma/client';
import { notificationRepo, notificationTargetRepo } from '../Repository/instances.js';

type SendInput = {
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  message: string;
};

class NotificationService {

  // ─── User-facing queries ───────────────────────────────────────────────────

  async getUserNotificationsPage(user_id: string, cursor?: string, limit = 20) {
    return notificationRepo.findUserNotificationsPage(user_id, limit, cursor);
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