import { Prisma, type post_hashtags } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class PostHashtagDao extends BaseDao<
  post_hashtags,
  Prisma.post_hashtagsCreateInput,
  Prisma.post_hashtagsUpdateInput,
  Prisma.post_hashtagsWhereUniqueInput
> {
  constructor() {
    super(prisma.post_hashtags);
  }

  async findByPost(post_id: string): Promise<post_hashtags[]> {
    return prisma.post_hashtags.findMany({
      where: { post_id },
      include: { hashtags: true },
    });
  }

  async findByHashtag(hashtag_id: string): Promise<post_hashtags[]> {
    return prisma.post_hashtags.findMany({
      where: { hashtag_id },
      include: { posts: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async attachHashtag(post_id: string, hashtag_id: string): Promise<post_hashtags> {
    return prisma.post_hashtags.create({
      data: {
        posts: { connect: { post_id } },
        hashtags: { connect: { hashtag_id } },
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
