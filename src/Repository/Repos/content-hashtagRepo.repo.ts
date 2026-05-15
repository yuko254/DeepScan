import { type content_hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

// NOTE: the schema uses content_hashtags (not post_hashtags) for post-level hashtags
export class ContentHashtagRepo extends BaseRepository<typeof prisma.content_hashtags> {
  constructor() {
    super(prisma.content_hashtags, 'content_hashtags', undefined);
  }

  async findById(): Promise<never> {
    throw new Error('ContentHashtagRepo does not support findById — use findUnique with composite key { content_id, hashtag_id }');
  }

  async findByContent(content_id: string): Promise<content_hashtags[]> {
    return prisma.content_hashtags.findMany({
      where: { content_id },
      include: { hashtag: true },
    });
  }

  async findByHashtag(hashtag_id: string): Promise<content_hashtags[]> {
    return prisma.content_hashtags.findMany({
      where: { hashtag_id },
      include: { content: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async attach(content_id: string, hashtag_id: string): Promise<content_hashtags> {
    return prisma.content_hashtags.create({
      data: {
        content: { connect: { content_id } },
        hashtag: { connect: { hashtag_id } },
      },
    });
  }

  async detach(content_id: string, hashtag_id: string): Promise<content_hashtags> {
    return prisma.content_hashtags.delete({
      where: { content_id_hashtag_id: { content_id, hashtag_id } },
    });
  }

  async sync(content_id: string, hashtag_ids: string[]): Promise<void> {
    await prisma.content_hashtags.deleteMany({ where: { content_id } });
    if (hashtag_ids.length > 0) {
      await prisma.content_hashtags.createMany({
        data: hashtag_ids.map((hashtag_id) => ({ content_id, hashtag_id })),
      });
    }
  }
}
