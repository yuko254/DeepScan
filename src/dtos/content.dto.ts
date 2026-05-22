import { z } from 'zod';
import * as zod from '../validations/validation.js';

export const GetPostParam = z.strictObject({
  post_id: zod.byId.uuid('postId'),
});

export const GetCommentParam = z.strictObject({
  comment_id: zod.byId.uuid('commentId'),
});

export const GetStoryParam = z.strictObject({
  story_id: zod.byId.uuid('storyId'),
});

export type GetPostParamType = z.infer<typeof GetPostParam>;
export type GetCommentParamType = z.infer<typeof GetCommentParam>;
export type GetStoryParamType = z.infer<typeof GetStoryParam>;
