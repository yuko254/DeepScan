import { z } from 'zod';
import { IdSchema, JsonSchema } from './fields/common.fields.js';
import { LocationCreateSchema } from './location.schema.js';

// ─── Enums ───
const ContentTypeSchema = z.enum(['post', 'story', 'scan']);
const VisibilitySchema = z.enum(['public', 'followers', 'private']);

// ─── Post ───
const PostCreateSchema = z.strictObject({
  category_id: IdSchema.number('categoryId').nullable(),
  location: LocationCreateSchema.nullable(),
  tagsIds: z.array(IdSchema.number('tagId')).nullable(),
});

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  content_id: IdSchema.uuid('contentId')
});

// ─── Story ───
export const StoryCreateSchema = z.strictObject({
  expires_at: z.coerce.date().nullable()
});

// ─── Scan ───
export const ScanCreateSchema = z.strictObject({
  metadata: JsonSchema,
  location: LocationCreateSchema.nullable(),
});

export const ScanUpdateSchema = ScanCreateSchema.partial().extend({
  content_id: IdSchema.uuid('contentId')
});

// ─── Main Content ───
export const ContentCreateSchema = z.strictObject({
  type: ContentTypeSchema,
  visibility: VisibilitySchema.default('public'),
  content_map: JsonSchema,
  post: PostCreateSchema.optional(),
  story: StoryCreateSchema.optional(),
  scan: ScanCreateSchema.optional(),
});

export const ContentUpdateSchema = z.strictObject({
  content_id: IdSchema.uuid('contentId'),
  visibility: VisibilitySchema.optional(),
  content_map: JsonSchema.optional(),
  post: PostUpdateSchema.optional(),
  scan: ScanUpdateSchema.optional(),
});

// ─── ID Params ───
export const ContentIdParamSchema = z.strictObject({
  content_id: IdSchema.uuid('contentId'),
});

export const PostIdParamSchema = z.strictObject({
  post_id: IdSchema.uuid('postId'),
});

export const StoryIdParamSchema = z.strictObject({
  story_id: IdSchema.uuid('storyId'),
});

export const ScanIdParamSchema = z.strictObject({
  scan_id: IdSchema.uuid('scanId'),
});

// ─── Types ───
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type Visibility = z.infer<typeof VisibilitySchema>;

export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;

export type StoryCreate = z.infer<typeof StoryCreateSchema>;

export type ScanCreate = z.infer<typeof ScanCreateSchema>;
export type ScanUpdate = z.infer<typeof ScanUpdateSchema>;

export type ContentCreate = z.infer<typeof ContentCreateSchema>;
export type ContentUpdate = z.infer<typeof ContentUpdateSchema>;