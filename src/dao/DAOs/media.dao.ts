import { Prisma, type media } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class MediaDao extends BaseDao<
  media,
  Prisma.mediaCreateInput,
  Prisma.mediaUpdateInput,
  Prisma.mediaWhereUniqueInput
> {
  constructor() {
    super(prisma.media);
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
