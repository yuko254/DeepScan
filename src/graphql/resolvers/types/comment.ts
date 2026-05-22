import { prisma } from '../../../config/prisma.js';
import type { GraphqlContext } from '../../../dtos/dto.js';

export const CommentTypeResolver = {
  isLiked: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id) return false;
    const like = await prisma.comment_likes.findUnique({
      where: {
        user_id_comment_id: {
          user_id: context.user.user_id,
          comment_id: parent.comment_id
        }
      }
    });
    return !!like;
  },
  
  likesCount: async (parent: any) => {
    return await prisma.comment_likes.count({
      where: { comment_id: parent.comment_id }
    });
  }
};