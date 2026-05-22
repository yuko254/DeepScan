import type { GraphqlContext } from '../../../dtos/dto.js';

export const ProfileTypeResolver = {
  isMyProfile: (parent: any, _: any, context: GraphqlContext) => {
    return context.user?.user_id === parent.user_id;
  }
};