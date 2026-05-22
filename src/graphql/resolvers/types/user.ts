import { prisma } from '../../../config/prisma.js';
import type { GraphqlContext } from '../../../dtos/dto.js';

export const UserTypeResolver = {
  isFollowing: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id || context.user.user_id === parent.user_id) return false;
    const follow = await prisma.follows.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: context.user.user_id,
          following_id: parent.user_id
        }
      }
    });
    return !!follow;
  },
  
  isBlocked: async (parent: any, _: any, context: GraphqlContext) => {
    if (!context.user?.user_id || context.user.user_id === parent.user_id) return false;
    const block = await prisma.blocks.findUnique({
      where: {
        blocker_id_blocked_id: {
          blocker_id: context.user.user_id,
          blocked_id: parent.user_id
        }
      }
    });
    return !!block;
  },
  
  isMe: (parent: any, __: any, context: GraphqlContext) => {
    return context.user?.user_id === parent.user_id;
  },
  
  followersCount: async (parent: any) => {
    return await prisma.follows.count({
      where: { following_id: parent.user_id }
    });
  },
  
  followingCount: async (parent: any) => {
    return await prisma.follows.count({
      where: { follower_id: parent.user_id }
    });
  }
};