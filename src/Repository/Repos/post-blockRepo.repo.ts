import { Prisma, type post_blocks } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostBlockRepo extends BaseRepository<
  typeof prisma.post_blocks
> {
  constructor() {
    super(prisma.post_blocks, 'post_blocks', 'block_id');
  }

  async findByPost(post_id: string): Promise<post_blocks[]> {
    return prisma.post_blocks.findMany({
      where: { post_id },
      orderBy: { position: 'asc' },
    });
  }

  async findByType(post_id: string, type: string): Promise<post_blocks[]> {
    return prisma.post_blocks.findMany({
      where: { post_id, type },
      orderBy: { position: 'asc' },
    });
  }

  async reorder(post_id: string, block_id: string, new_position: number): Promise<post_blocks> {
    return prisma.post_blocks.update({
      where: { block_id },
      data: { position: new_position },
    });
  }
}
