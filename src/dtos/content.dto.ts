import { z } from 'zod';
import * as zod from '../validations/validation.js';

export const GetPostParam = z.strictObject({
  post_id: zod.UUID,
});

export const GetCommentParam = z.strictObject({
  comment_id: zod.UUID,
});

export const GetStoryParam = z.strictObject({
  story_id: zod.UUID,
});

export type GetPostParamType = z.infer<typeof GetPostParam>;
export type GetCommentParamType = z.infer<typeof GetCommentParam>;
export type GetStoryParamType = z.infer<typeof GetStoryParam>;
