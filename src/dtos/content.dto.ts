import { z } from 'zod';
import * as zod from '../validations/validation.js';

export const GetPostParam = z.object({
  post_id: zod.UUID,
});

export const GetCommentParam = z.object({
  comment_id: zod.UUID,
});

export const GetStoryParam = z.object({
  story_id: zod.UUID,
});

export type GetPostParamType = z.infer<typeof GetPostParam>;
export type GetCommentParamType = z.infer<typeof GetCommentParam>;
export type GetStoryParamType = z.infer<typeof GetStoryParam>;
