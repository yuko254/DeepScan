import { type report_targets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ReportTargetRepo extends BaseRepository<typeof prisma.report_targets> {
  constructor() {
    super(prisma.report_targets, 'report_targets', 'target_id');
  }

  async findOrCreateForPost(post_id: string): Promise<report_targets> {
    const existing = await prisma.report_targets.findFirst({ where: { post_id } });
    if (existing) return existing;
    return prisma.report_targets.create({ data: { post: { connect: { content_id: post_id } } } });
  }

  async findOrCreateForComment(comment_id: string): Promise<report_targets> {
    const existing = await prisma.report_targets.findFirst({ where: { comment_id } });
    if (existing) return existing;
    return prisma.report_targets.create({ data: { comment: { connect: { comment_id } } } });
  }

  async findOrCreateForStory(story_id: string): Promise<report_targets> {
    const existing = await prisma.report_targets.findFirst({ where: { story_id } });
    if (existing) return existing;
    return prisma.report_targets.create({ data: { story: { connect: { content_id: story_id } } } });
  }

  async findByPost(post_id: string): Promise<report_targets | null> {
    return prisma.report_targets.findFirst({ where: { post_id }, include: { reports: true } });
  }

  async findByComment(comment_id: string): Promise<report_targets | null> {
    return prisma.report_targets.findFirst({ where: { comment_id }, include: { reports: true } });
  }

  async findByStory(story_id: string): Promise<report_targets | null> {
    return prisma.report_targets.findFirst({ where: { story_id }, include: { reports: true } });
  }
}
