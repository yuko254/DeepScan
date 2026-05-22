import { type contents, ContentType, Visibility } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ContentRepo extends BaseRepository<typeof prisma.contents> {
  constructor() {
    super(prisma.contents, 'contents', 'content_id');
  }

  async findByUser(user_id: string, type?: ContentType) {
    return this.model.findMany({
      where: { user_id, ...(type && { type }) },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByType(type: ContentType, visibility?: Visibility) {
    return this.model.findMany({
      where: { type, ...(visibility && { visibility }) },
      orderBy: { created_at: 'desc' },
    });
  }

  async findPost(post_id: string) {
    return this.model.findUnique({
      where: { content_id: post_id },
      include: { post: true },
    });
  }

  async findStory(story_id: string) {
    return this.model.findUnique({
      where: { content_id: story_id },
      include: { story: true, media: true },
    });
  }

  async findScan(scan_id: string) {
    return this.model.findUnique({
      where: { content_id: scan_id },
      include: { scan: true, media: true },
    });
  }

  async updateVisibility(content_id: string, visibility: Visibility) {
    return this.model.update({ where: { content_id }, data: { visibility } });
  }

  async softDelete(content_id: string, deletor?: string) {
    return this.model.update({ where: { content_id }, data: { is_deleted: true, content: deletor ? `deleted by ${deletor}` : undefined }});
  }
}

