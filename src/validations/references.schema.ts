import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';

// ─── Category ───
export const CategoryCreateSchema = z.strictObject({
  name: z.string().min(1, 'Category name required').max(50, 'Category name too long'),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial().extend({
  category_id: IdSchema.number('categoryId'),
});

// ─── Tag ───
export const TagCreateSchema = z.strictObject({
  name: z.string().min(1, 'Tag name required').max(50, 'Tag name too long'),
});

export const TagUpdateSchema = TagCreateSchema.partial().extend({
  tag_id: IdSchema.number('tagId'),
});

// ─── ID Params ───
export const CategoryIdParamSchema = z.strictObject({
  category_id: IdSchema.number('categoryId'),
});

export const TagIdParamSchema = z.strictObject({
  tag_id: IdSchema.number('tagId'),
});

// ─── Types ───
export type CategoryCreate = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdate = z.infer<typeof CategoryUpdateSchema>;

export type TagCreate = z.infer<typeof TagCreateSchema>;
export type TagUpdate = z.infer<typeof TagUpdateSchema>;