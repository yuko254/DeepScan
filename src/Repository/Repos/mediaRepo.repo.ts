import { type media, MediaType } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MediaRepo extends BaseRepository<typeof prisma.media> {
  constructor() {
    super(prisma.media, 'media', 'media_id');
  }

  async findByContent(content_id: string): Promise<media[]> {
    return prisma.media.findMany({ where: { content_id } });
  }

  async findByType(content_id: string, type: MediaType): Promise<media[]> {
    return prisma.media.findMany({ where: { content_id, type } });
  }

  async findByStoragePath(storage_path: string): Promise<media | null> {
    return prisma.media.findFirst({ where: { storage_path } });
  }

  async deleteByContent(content_id: string): Promise<void> {
    await prisma.media.deleteMany({ where: { content_id } });
  }
}
