import { prisma } from '../../../config/prisma.js';
import type { GraphqlContext } from '../../../dtos/dto.js';

export const StoryTypeResolver = {
  viewCount: async (parent: any) => {
    return await prisma.story_views.count({
      where: { story_id: parent.content_id }
    });
  },
  
  hasViewed: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id) return false;
    const view = await prisma.story_views.findUnique({
      where: {
        viewer_id_story_id: {
          viewer_id: context.user.user_id,
          story_id: parent.content_id
        }
      }
    });
    return !!view;
  }
};