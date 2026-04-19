import { Prisma, type post_blocks } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class PostBlockDao extends BaseDao<
  post_blocks,
  Prisma.post_blocksCreateInput,
  Prisma.post_blocksUpdateInput,
  Prisma.post_blocksWhereUniqueInput
> {
  constructor() {
    super(prisma.post_blocks);
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
