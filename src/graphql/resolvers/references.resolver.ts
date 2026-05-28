import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { categoryService } from '../../services/references/category.service.js';
import { tagService } from '../../services/references/tag.service.js';
import { hashtagService } from '../../services/references/hashtag.service.js';
import * as idSchema from '../../validations/id.schema.js';
import * as referencesSchema from '../../validations/references.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';
import { requireAdmin } from './helper.js';

export const referencesResolver: Resolvers = {
  Query: {
    categories: async (_, args) => {
      const { search } = querySchema.parse({ search: args.search });
      if (!search) return [];
      const categories = await categoryService.search(search);
      return categories as any;
    },

    tags: async (_, args) => {
      const { search } = querySchema.parse({ search: args.search });
      if (!search) return [];
      const tags = await tagService.search(search);
      return tags as any;
    },

    hashtags: async (_, args) => {
      const { search } = querySchema.parse({ search: args.search });
      if (!search) return [];
      const hashtags = await hashtagService.search(search);
      return hashtags as any;
    },
  },

  Mutation: {
    createCategory: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = referencesSchema.CategoryCreateSchema.parse(args.data);
      const category = await categoryService.create(input);
      return category as any;
    },

    updateCategory: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = referencesSchema.CategoryUpdateSchema.parse(args.data);
      const category = await categoryService.update(input);
      return category as any;
    },

    deleteCategory: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const { category_id } = idSchema.CategoryIdParamSchema.parse({ category_id: parseInt(args.id) });
      await categoryService.delete(category_id);
      return true;
    },

    createTag: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = referencesSchema.TagCreateSchema.parse(args.data);
      const tag = await tagService.create(input);
      return tag as any;
    },

    updateTag: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = referencesSchema.TagUpdateSchema.parse(args.data);
      const tag = await tagService.update(input);
      return tag as any;
    },

    deleteTag: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const { tag_id } = idSchema.TagIdParamSchema.parse({ tag_id: parseInt(args.id) });
      await tagService.delete(tag_id);
      return true;
    },
  },
};