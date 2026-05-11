import { Prisma, type media } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class MediaRepo extends BaseRepository<
  typeof prisma.media
> {
  constructor() {
    super(prisma.media, 'media', 'media_id');
  }

  async findByPost(post_id: string): Promise<media[]> {
    return prisma.media.findMany({ where: { post_id } });
  }

  async findByStory(story_id: string): Promise<media[]> {
    return prisma.media.findMany({ where: { story_id } });
  }

  async findByScan(scan_id: string): Promise<media[]> {
    return prisma.media.findMany({ where: { scan_id } });
  }
}
