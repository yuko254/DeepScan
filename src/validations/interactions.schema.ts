import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';
import * as pagination from "./fields/pagination.fields.js";

// ─── Enums ───
const StatusSchema = z.enum(['pending', 'reviewed', 'resolved', 'dismissed']);

// ─── Report ───
export const ReportCreateSchema = z.strictObject({
  report_target_id: IdSchema.uuid('reportTargetId'),
  reason: z.string().min(20),
});

export const ReportUpdateSchema = ReportCreateSchema.partial().extend({
  report_id: IdSchema.uuid('reportId'),
});

export const ReportResolveSchema = z.strictObject({
  report_id: IdSchema.uuid('reportId').optional(),
  resolver_id: IdSchema.uuid('resolverId'),
  status: StatusSchema,
});

// ─── Comment ───
export const CommentCreateSchema = z.strictObject({
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
  post_id: IdSchema.uuid('postId'),
  comment_parent_id: IdSchema.uuid('parentCommentId').nullish(),
});

export const CommentUpdateSchema = z.strictObject({
  comment_id: IdSchema.uuid('commentId'),
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment too long'),
});

// ─── Follow Request ───
export const FollowRequestCreateSchema = z.strictObject({
  target_id: IdSchema.uuid('targetId'),
});

export const FollowRequestUpdateSchema = z.strictObject({
  follow_request_id: IdSchema.number('followRequestId'),
  status: z.enum(['accepted', 'rejected']),
});

// ─── Searches ───
export const ReportsQuerySchema = z.strictObject({
  page: pagination.pageQuery,
  limit: pagination.pageLimitQuery,
  status: StatusSchema.optional(),
  reporter: IdSchema.uuid('reporterId').optional(),
  resolver: IdSchema.uuid('resolverId').optional(),
  reported: IdSchema.uuid('reporetedId').optional(),
}).transform(({ status, reporter, resolver, reported, ...rest }) => ({
  ...rest,
  filters: { status, reporter_id: reporter, resolver_id: resolver, report_target_id: reported }
}));

// ─── ID Params ───
export const ReportIdParamSchema = z.strictObject({
  report_id: IdSchema.uuid('reportId'),
});

export const CommentIdParamSchema = z.strictObject({
  comment_id: IdSchema.uuid('commentId'),
});

export const FollowRequestIdParamSchema = z.strictObject({
  follow_request_id: IdSchema.number('followRequestId'),
});

// ─── Types ───
export type Status = z.infer<typeof StatusSchema>;

export type ReportCreate = z.infer<typeof ReportCreateSchema>;
export type ReportUpdate = z.infer<typeof ReportUpdateSchema>;
export type ReportResolve = z.infer<typeof ReportResolveSchema>;
export type ReportsQuery = z.infer<typeof ReportsQuerySchema>;

export type CommentCreate = z.infer<typeof CommentCreateSchema>;
export type CommentUpdate = z.infer<typeof CommentUpdateSchema>;

export type FollowRequestCreate = z.infer<typeof FollowRequestCreateSchema>;
export type FollowRequestUpdate = z.infer<typeof FollowRequestUpdateSchema>;
