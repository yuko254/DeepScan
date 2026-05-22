import { type report_targets } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ReportTargetRepo extends BaseRepository<typeof prisma.report_targets> {
  constructor() {
    super(prisma.report_targets, 'report_targets', 'target_id');
  }

  async findOrCreateForPost(post_id: string) {
    const existing = await this.model.findUnique({ where: { post_id } });
    if (existing) return existing;
    return this.model.create({ data: { post: { connect: { content_id: post_id } } } });
  }

  async findOrCreateForComment(comment_id: string) {
    const existing = await this.model.findUnique({ where: { comment_id } });
    if (existing) return existing;
    return this.model.create({ data: { comment: { connect: { comment_id } } } });
  }

  async findOrCreateForStory(story_id: string) {
    const existing = await this.model.findUnique({ where: { story_id } });
    if (existing) return existing;
    return this.model.create({ data: { story: { connect: { content_id: story_id } } } });
  }

  async findOrCreateForProfile(profile_id: string) {
    const existing = await this.model.findUnique({ where: { profile_id } });
    if (existing) return existing;
    return this.model.create({ data: { profile: { connect: { profile_id } } } });
  }

  async findByPost(post_id: string) {
    return this.model.findUnique({ where: { post_id }, include: { reports: true } });
  }

  async findByComment(comment_id: string) {
    return this.model.findUnique({ where: { comment_id }, include: { reports: true } });
  }

  async findByStory(story_id: string) {
    return this.model.findUnique({ where: { story_id }, include: { reports: true } });
  }

  async findByProfile(profile_id: string) {
    return this.model.findUnique({ where: { profile_id }, include: { reports: true } });
  }
}
