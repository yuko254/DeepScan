import { z } from 'zod';
<<<<<<< HEAD
import { IdSchema, JsonSchema } from './fields/common.fields.js';
=======
import { IdSchema, JsonSchema, booleanString } from './fields/common.fields.js';
>>>>>>> dev
import { LocationCreateSchema, LocationUpsertSchema } from './location.schema.js';

// ─── Enums ───
const ContentTypeSchema = z.enum(['post', 'story', 'scan']);
<<<<<<< HEAD
const VisibilitySchema = z.enum(['public', 'followers', 'private']);
=======
>>>>>>> dev

// ─── Post ───
const PostCreateSchema = z.strictObject({
  category_id: IdSchema.number('categoryId').nullable(),
  location: LocationCreateSchema.nullable(),
  tagsIds: z.array(IdSchema.number('tagId')).nullable(),
});

export const PostUpdateSchema = PostCreateSchema.partial().extend({
  content_id: IdSchema.uuid('contentId'),
  location: LocationUpsertSchema.nullish(),
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
  content_id: IdSchema.uuid('contentId'),
  location: LocationUpsertSchema.nullish(),
});

// ─── Main Content ───
export const ContentCreateSchema = z.strictObject({
  type: ContentTypeSchema,
<<<<<<< HEAD
  visibility: VisibilitySchema.default('public'),
=======
  is_private: booleanString.default(false),
>>>>>>> dev
  content_map: JsonSchema,
  post: PostCreateSchema.optional(),
  story: StoryCreateSchema.optional(),
  scan: ScanCreateSchema.optional(),
<<<<<<< HEAD
});

export const ContentUpdateSchema = z.strictObject({
  content_id: IdSchema.uuid('contentId'),
  visibility: VisibilitySchema.optional(),
  content_map: JsonSchema.optional(),
  post: PostUpdateSchema.optional(),
  scan: ScanUpdateSchema.optional(),
});

// ─── Types ───
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type Visibility = z.infer<typeof VisibilitySchema>;
=======
}).refine(
  (data) => [data.post, data.story, data.scan].filter(Boolean).length === 1,
  { message: "Exactly one of 'post', 'story', or 'scan' must be provided" }
);

export const ContentUpdateSchema = z.strictObject({
  content_id: IdSchema.uuid('contentId'),
  is_private: booleanString.optional(),
  content_map: JsonSchema.optional(),
  post: PostUpdateSchema.optional(),
  scan: ScanUpdateSchema.optional(),
}).refine(
  (data) => {
    const hasPostOrScan = [data.post, data.scan].filter(Boolean).length;
    return (hasPostOrScan === 1) || (data.content_map !== undefined);
  },
  { message: "Either provide exactly one of 'post' or 'scan', or provide 'content_map' for update" }
);

// ─── Types ───
export type ContentType = z.infer<typeof ContentTypeSchema>;
>>>>>>> dev

export type PostCreate = z.infer<typeof PostCreateSchema>;
export type PostUpdate = z.infer<typeof PostUpdateSchema>;

export type StoryCreate = z.infer<typeof StoryCreateSchema>;

export type ScanCreate = z.infer<typeof ScanCreateSchema>;
export type ScanUpdate = z.infer<typeof ScanUpdateSchema>;

export type ContentCreate = z.infer<typeof ContentCreateSchema>;
export type ContentUpdate = z.infer<typeof ContentUpdateSchema>;