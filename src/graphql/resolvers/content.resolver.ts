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
    post: async (_, args, context: GraphqlContext) => {
      const { post_id } = idSchema.PostIdParamSchema.parse({ post_id: args.id });
      const post = await postService.getPost(post_id);
      await postService.validatePostAccess(post.content.user_id, context.user?.user_id);
      const filtered = postService.filterPrivatePosts([post], context.user?.user_id);
      return filtered[0] as any;
    },

    userPosts: async (_, args, context: GraphqlContext) => {
      const { user_id } = idSchema.UserIdParamSchema.parse({ user_id: args.userId });
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      await postService.validatePostAccess(user_id, context.user?.user_id);
      const { posts, nextCursor } = await postService.getUserPosts(user_id, input.limit, input.cursor);
      const filtered = postService.filterPrivatePosts(posts, context.user?.user_id);
      return { posts: filtered as any, nextCursor };
    },

    userStories: async (_, args, context: GraphqlContext) => {
      const { user_id } = idSchema.UserIdParamSchema.parse({ user_id: args.userId });
      await storyService.deleteExpiredStories(user_id);
      await storyService.validateStoryAccess(user_id, context.user?.user_id);
      const { stories } = await storyService.getUserActiveStories(user_id);
      const filtered = storyService.filterPrivateStories(stories, context.user?.user_id)
      return filtered as any;
    },

    userPostsCount: async (_, args) => {
      const { user_id } = idSchema.UserIdParamSchema.parse({ user_id: args.userId });
      return postService.getUserPostsCount(user_id);
    },

    myPostsCount: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      return postService.getUserPostsCount(context.user.user_id, true);
    },

    myPosts: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { posts, nextCursor } = await postService.getUserPosts(context.user.user_id, input.limit, input.cursor);
      return { posts: posts as any, nextCursor };
    },

    mySavedPosts: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { savedPosts, nextCursor } = await postService.getUserSavedPosts(context.user.user_id, input.limit, input.cursor);
      return { posts: savedPosts as any, nextCursor };
    },

    myStories: async (_, __, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      await storyService.deleteExpiredStories(context.user.user_id);
      const { stories } = await storyService.getUserActiveStories(context.user.user_id);
      return stories as any;
    },

    myScans: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = querySchema.parse({ cursor: args.cursor, limit: args.limit });
      const { scans, nextCursor } = await scanService.getUserScans(context.user.user_id, input.limit, input.cursor);
      return { scans: scans as any, nextCursor };
    },

    scan: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { scan_id } = idSchema.ScanIdParamSchema.parse({ scan_id: args.id });
      const scan = await scanService.getScan(scan_id);
      await scanService.validateScanAccess(scan.content.user_id, context.user.user_id);
      return scan as any;
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