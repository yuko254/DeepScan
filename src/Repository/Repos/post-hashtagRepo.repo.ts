import { Prisma, type post_hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostHashtagRepo extends BaseRepository<
  typeof prisma.post_hashtags
> {
  constructor() {
    super(prisma.post_hashtags, 'post_hashtags', undefined);
  }
  async findById(): Promise<never> {
    throw new Error('BlockRepo does not support findById — use findUnique with composite key { blocker_id, blocked_id }');
  }

  async findByPost(post_id: string): Promise<post_hashtags[]> {
    return prisma.post_hashtags.findMany({
      where: { post_id },
      include: { hashtag: true },
    });
  }

  async findByHashtag(hashtag_id: string): Promise<post_hashtags[]> {
    return prisma.post_hashtags.findMany({
      where: { hashtag_id },
      include: { post: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async attachHashtag(post_id: string, hashtag_id: string): Promise<post_hashtags> {
    return prisma.post_hashtags.create({
      data: {
        post: { connect: { post_id } },
        hashtag: { connect: { hashtag_id } },
      },
    });
  }

  async detachHashtag(post_id: string, hashtag_id: string): Promise<post_hashtags> {
    return prisma.post_hashtags.delete({
      where: { post_id_hashtag_id: { post_id, hashtag_id } },
    });
  }

  async syncHashtags(post_id: string, hashtag_ids: string[]): Promise<void> {
    await prisma.post_hashtags.deleteMany({ where: { post_id } });
    await prisma.post_hashtags.createMany({
      data: hashtag_ids.map((hashtag_id) => ({ post_id, hashtag_id })),
    });
  }
}
