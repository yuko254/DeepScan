import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { contentService } from '../../services/content/content.service.js';
import { postService } from '../../services/content/post.service.js';
import { scanService } from '../../services/content/scan.service.js';
import { storyService } from '../../services/content/story.service.js';
import * as idSchema from '../../validations/id.schema.js';
import * as contentSchema from '../../validations/content.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';

export const contentResolver: Resolvers = {
  Query: {
    post: async (_, args) => {
      const { post_id } = idSchema.PostIdParamSchema.parse({ post_id: args.id });
      const post = await postService.getPost(post_id);
      return post as any;
    },

    userPosts: async (_, args) => {
      const { user_id } = idSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { posts, nextCursor } = await postService.getUserPosts(user_id, input.limit, input.cursor);
      return { posts: posts as any, nextCursor };
    },

    mySavedPosts: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { savedPosts, nextCursor } = await postService.getUserSavedPosts(context.user.user_id, input.limit, input.cursor);
      return { posts: savedPosts as any, nextCursor };
    },

    scan: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { scan_id } = idSchema.ScanIdParamSchema.parse({ scan_id: args.id });
      const scan = await scanService.getScan(context.user.user_id, scan_id);
      return scan as any;
    },

    myScans: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { scans, nextCursor } = await scanService.getUserScans(context.user.user_id, input.limit, input.cursor);
      return { scans: scans as any, nextCursor };
    },
  },

  Mutation: {
    createContent: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = contentSchema.ContentCreateSchema.parse(args.data);
      const content = await contentService.createContent(context.user.user_id, input);
      return content as any;
    },

    updateContent: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = contentSchema.ContentUpdateSchema.parse(args.data);
      const content = await contentService.updateContent(context.user.user_id, input);
      return content as any;
    },

    deleteContent: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { content_id } = idSchema.ContentIdParamSchema.parse({ content_id: args.id });
      await contentService.deleteContent(context.user.user_id, content_id);
      return true;
    },

    toggleLikePost: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { content_id } = idSchema.ContentIdParamSchema.parse({ content_id: args.postId });
      const result = await postService.toggleLike(context.user.user_id, content_id);
      return result.liked;
    },

    toggleSavePost: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { content_id } = idSchema.ContentIdParamSchema.parse({ content_id: args.postId });
      const result = await postService.toggleSave(context.user.user_id, content_id);
      return result.saved;
    },

    viewStory: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { content_id } = idSchema.ContentIdParamSchema.parse({ content_id: args.storyId });
      const result = await storyService.viewStory(context.user.user_id, content_id);
      return result as any;
    }
  },


  posts: {
    isLiked: async (parent, _, context: GraphqlContext) => {
      return context.loaders.post.isLiked.load(parent.content.content_id);
    },

    isSaved: async (parent, _, context: GraphqlContext) => {
      return context.loaders.post.isSaved.load(parent.content.content_id);
    },

    likesCount: async (parent, _, context: GraphqlContext) => {
      return context.loaders.post.likesCount.load(parent.content.content_id);
    },

    savesCount: async (parent, _, context: GraphqlContext) => {
      return context.loaders.post.savesCount.load(parent.content.content_id);
    },

    commentsCount: async (parent, _, context: GraphqlContext) => {
      return context.loaders.post.commentsCount.load(parent.content.content_id);
    },

    tags: async (parent) => {
      const rawParent = parent as any;
      return rawParent.postTags?.map((pt: any) => pt.tag) || [];
    }
  },

  stories: {
    viewCount: async (parent, _, context: GraphqlContext) => {
      return context.loaders.story.viewCount.load(parent.content.content_id);
    },

    hasViewed: async (parent, _, context: GraphqlContext) => {
      return context.loaders.story.hasViewed.load(parent.content.content_id);
    }
  }
};