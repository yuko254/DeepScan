import { type comment_hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentHashtagRepo extends BaseRepository<typeof prisma.comment_hashtags> {
  constructor() {
    super(prisma.comment_hashtags, 'comment_hashtags', undefined);
  }

  async findById(): Promise<never> {
    throw new Error('CommentHashtagRepo does not support findById — use findUnique with composite key { comment_id, hashtag_id }');
  }

  async findByComment(comment_id: string): Promise<comment_hashtags[]> {
    return prisma.comment_hashtags.findMany({
      where: { comment_id },
      include: { hashtag: true },
    });
  }

  async findByHashtag(hashtag_id: string): Promise<comment_hashtags[]> {
    return prisma.comment_hashtags.findMany({
      where: { hashtag_id },
      include: { comment: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async attach(comment_id: string, hashtag_id: string): Promise<comment_hashtags> {
    return prisma.comment_hashtags.create({
      data: {
        comment: { connect: { comment_id } },
        hashtag: { connect: { hashtag_id } },
      },
    });
  }

  async detach(comment_id: string, hashtag_id: string): Promise<comment_hashtags> {
    return prisma.comment_hashtags.delete({
      where: { comment_id_hashtag_id: { comment_id, hashtag_id } },
    });
  }

  async sync(comment_id: string, hashtag_ids: string[]): Promise<void> {
    await prisma.comment_hashtags.deleteMany({ where: { comment_id } });
    if (hashtag_ids.length > 0) {
      await prisma.comment_hashtags.createMany({
        data: hashtag_ids.map((hashtag_id) => ({ comment_id, hashtag_id })),
      });
    }
  }
}
