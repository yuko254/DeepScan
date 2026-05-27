import { type notification_targets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class NotificationTargetRepo extends BaseRepository<typeof prisma.notification_targets> {
  constructor() {
    super(prisma.notification_targets, 'notification_targets', 'target_id');
  }

  async findOrCreateForPost(post_id: string) {
    const existing = await this.model.findFirst({ where: { post_id } });
    if (existing) return existing;
    return this.model.create({ data: { post: { connect: { content_id: post_id } } } });
  }

  async findOrCreateForComment(comment_id: string) {
    const existing = await this.model.findFirst({ where: { comment_id } });
    if (existing) return existing;
    return this.model.create({ data: { comment: { connect: { comment_id } } } });
  }

  async findOrCreateForChat(chat_id: string) {
    const existing = await this.model.findFirst({ where: { chat_id } });
    if (existing) return existing;
    return this.model.create({ data: { chat: { connect: { chat_id } } } });
  }

  async findByPost(post_id: string) {
    return this.model.findFirst({ where: { post_id } });
  }

  async findByComment(comment_id: string) {
    return this.model.findFirst({ where: { comment_id } });
  }

  async findByChat(chat_id: string) {
    return this.model.findFirst({ where: { chat_id } });
  }
}
