import { contents, ContentType, Visibility } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ContentRepo extends BaseRepository<typeof prisma.contents> {
  constructor() {
    super(prisma.contents, 'contents', 'content_id');
  }

  private includeDetails = {
    post: true,
    story: true,
    scan: true
  }

  async findByUser(user_id: string, type?: ContentType) {
    return this.model.findMany({
      where: { user_id, ...(type && { type }) },
      include: this.includeDetails,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByType(type: ContentType, visibility?: Visibility) {
    return this.model.findMany({
      where: { type, ...(visibility && { visibility }) },
      include: this.includeDetails,
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
      include: { story: true },
    });
  }

  async findScan(scan_id: string) {
    return this.model.findUnique({
      where: { content_id: scan_id },
      include: { scan: true },
    });
  }

  async createContent(data: Prisma.contentsUncheckedCreateInput) {
    return this.model.create({
      data,
      include: this.includeDetails
    });
  }

  async updateContent(data: Prisma.contentsUncheckedUpdateInput) {
    return this.model.update({
      where: { content_id: data.content_id as string },
      data,
      include: this.includeDetails
    });
  }

  async softDelete(content_id: string, deletor?: string) {
    return this.model.update({
      where: { content_id },
      data: { is_deleted: true, content: deletor ? `deleted by ${deletor}` : undefined }
    });
  }
}

