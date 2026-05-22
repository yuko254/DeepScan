import { prisma } from '../../../config/prisma.js';
import type { GraphqlContext } from '../../../dtos/dto.js';

export const PostTypeResolver = {
  isLiked: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id) return false;
    const like = await prisma.post_likes.findUnique({
      where: {
        user_id_post_id: {
          user_id: context.user.user_id,
          post_id: parent.content_id
        }
      }
    });
    return !!like;
  },
  
  isSaved: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id) return false;
    const saved = await prisma.saved_posts.findUnique({
      where: {
        user_id_post_id: {
          user_id: context.user.user_id,
          post_id: parent.content_id
        }
      }
    });
    return !!saved;
  },
  
  likesCount: async (parent: any) => {
    return await prisma.post_likes.count({
      where: { post_id: parent.content_id }
    });
  },
  
  commentsCount: async (parent: any) => {
    return await prisma.comments.count({
      where: { post_id: parent.content_id, is_deleted: false }
    });
  },
  
  savesCount: async (parent: any) => {
    return await prisma.saved_posts.count({
      where: { post_id: parent.content_id }
    });
  }
};