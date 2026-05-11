import { Prisma, type comment_likes } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CommentLikeRepo extends BaseRepository<
  typeof prisma.comment_likes
> {
  constructor() {
    super(prisma.comment_likes, 'comment_likes');
  }

  async like(user_id: string, comment_id: string): Promise<comment_likes> {
    return prisma.comment_likes.create({
      data: {
        user: { connect: { user_id } },
        comment: { connect: { comment_id } },
      },
    });
  }

  async unlike(user_id: string, comment_id: string): Promise<comment_likes> {
    return prisma.comment_likes.delete({ where: { user_id_comment_id: { user_id, comment_id } } });
  }

  async isLiked(user_id: string, comment_id: string): Promise<boolean> {
    const like = await prisma.comment_likes.findUnique({
      where: { user_id_comment_id: { user_id, comment_id } },
    });
    return like !== null;
  }
}
