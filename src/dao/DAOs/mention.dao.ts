import { Prisma, type mentions } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class MentionDao extends BaseDao<
  mentions,
  Prisma.mentionsCreateInput,
  Prisma.mentionsUpdateInput,
  Prisma.mentionsWhereUniqueInput
> {
  constructor() {
    super(prisma.mentions);
  }

  async findByUser(mentioned_user_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({
      where: { mentioned_user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByPost(post_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({ where: { post_id } });
  }

  async findByComment(comment_id: string): Promise<mentions[]> {
    return prisma.mentions.findMany({ where: { comment_id } });
  }
}
