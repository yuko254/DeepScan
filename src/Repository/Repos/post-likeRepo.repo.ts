import { type post_likes } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class PostLikeRepo extends BaseRepository<typeof prisma.post_likes> {
  constructor() {
    super(prisma.post_likes, 'post_likes');
  }

  async like(user_id: string, post_id: string) {
    return this.model.create({
      data: {
        user: { connect: { user_id } },
        post: { connect: { content_id: post_id } }, // posts PK is content_id
      },
    });
  }

  async unlike(user_id: string, post_id: string) {
    return this.model.delete({ where: { user_id_post_id: { user_id, post_id } } });
  }

  async isLiked(user_id: string, post_id: string) {
    const like = await this.model.findUnique({
      where: { user_id_post_id: { user_id, post_id } },
    });
    return like !== null;
  }

  async getLikeCount(post_id: string) {
    return this.model.count({ where: { post_id } });
  }

  async getLikedPostsByUser(user_id: string) {
    return this.model.findMany({ where: { user_id } });
  }
}
