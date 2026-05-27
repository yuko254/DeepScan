import { type media, MediaType } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MediaRepo extends BaseRepository<typeof prisma.media> {
  constructor() {
    super(prisma.media, 'media', 'media_id');
  }

  async findByType(content_id: string, type: MediaType) {
    return this.model.findMany({ where: { content_id, type } });
  }

  async findByStoragePath(storage_path: string) {
    return this.model.findFirst({ where: { storage_path } });
  }
}
