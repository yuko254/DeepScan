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
      include: { media: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByType(type: ContentType, visibility?: Visibility) {
    return this.model.findMany({
      where: { type, ...(visibility && { visibility }) },
      include: { media: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateVisibility(content_id: string, visibility: Visibility) {
    return this.model.update({ where: { content_id }, data: { visibility } });
  }
}
