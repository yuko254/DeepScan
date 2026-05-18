import { z } from 'zod';
import * as zod from "../validations/validation.js";
import type * as Dto from "./dto.js";
import type { ReportFiltersDto } from "./searchFilters.dto.js";
import type { Reports, Posts, Comments, Stories, Profiles } from '../graphql/graphql.js';
import  { type UserAccountDto, toUserAccountDto } from './users.dto.js';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetReportParam = z.object({
  report_id: zod.UUID,
});

export const GetReportsQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  status: z.string().optional(),
  reporter: zod.UUID.optional(),
  resolver: zod.UUID.optional(),
  reported: zod.UUID.optional(),
}).transform(({ status, reporter, resolver, reported, ...rest }) => ({
  ...rest,
  filters: { status, reporter_id: reporter, resolver_id: resolver, report_target_id: reported } as ReportFiltersDto,
}));

export const ReportSchema = z.object({ 
    report_target_id: zod.UUID,
    reason: z.string().min(20),
});

export const UpdateReportSchema = z.object({ 
    report_id: zod.UUID,
    reason: z.string().min(20).optional(),
});

export const AdminUpdateReportSchema = UpdateReportSchema.extend({ 
    reason: z.undefined(),
    resolver_id: zod.UUID,
    status: z.string(),
});

// ─── Inferred types ───────────────────────────────────────────────────

export type GetReportsQuery = z.infer<typeof GetReportsQuerySchema>;

export type ReportBody = z.infer<typeof ReportSchema>;

export type UpdateReportBody = z.infer<typeof UpdateReportSchema>;
export type AdminUpdateReportBody = z.infer<typeof AdminUpdateReportSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface TargetSummary {
  target_id: string | null;
  type: 'post' | 'comment' | 'story' | 'profile' | null;
  entityId: string | null;
}

export type ReportListItem = Pick<
  Reports,
  'report_id' | 'reason' | 'status' | 'created_at' | 'resolved_at'
> & {
  reporter: UserAccountDto;               // full account summary
  resolver: UserAccountDto | null;        // full account summary, nullable
  target: TargetSummary;                  // lightweight polymorphic target
};

export type ReportDto = Pick<
  Reports,
  'report_id' | 'reason' | 'status' | 'created_at' | 'resolved_at'
> & {
  reporter: UserAccountDto;                           // full reporter account
  resolver: UserAccountDto | null;                    // full resolver account (if resolved)
  reported: Posts | Comments | Stories | Profiles | null; // the actual reported content
};

export interface ReportsPageDto {
  reports: ReportListItem[];
  pagination: Dto.PageDto;
}

// ─── Response DTO Mappers ───────────────────────────────────────────────────

function getReportTarget(reportTarget: any): TargetSummary {
  if (!reportTarget) {
    return { target_id: null, type: null, entityId: null };
  }

  if (reportTarget.post) {
    return { target_id: reportTarget.report_target_id, type: 'post', entityId: reportTarget.post.post_id };
  }
  if (reportTarget.comment) {
    return { target_id: reportTarget.report_target_id, type: 'comment', entityId: reportTarget.comment.comment_id };
  }
  if (reportTarget.story) {
    return { target_id: reportTarget.report_target_id, type: 'story', entityId: reportTarget.story.story_id };
  }
  if (reportTarget.profile) {
    return { target_id: reportTarget.report_target_id, type: 'profile', entityId: reportTarget.profile.profile_id };
  }

  return { target_id: reportTarget.report_target_id, type: null, entityId: null };
}

export function toReportListItemDto(report: any): ReportListItem {
  return {
    report_id: report.report_id,
    reason: report.reason,
    status: report.status,
    created_at: report.created_at,
    resolved_at: report.resolved_at,
    reporter: toUserAccountDto(report.user),
    resolver: report.resolver ? toUserAccountDto(report.resolver) : null,
    target: getReportTarget(report.report_target),
  };
}

export function toReportDto(report: any): ReportDto {
  let reported: Posts | Comments | Stories | Profiles | null = null;

  if (report.report_target) {
    if (report.report_target.post) reported = report.report_target.post;
    else if (report.report_target.comment) reported = report.report_target.comment;
    else if (report.report_target.story) reported = report.report_target.story;
    else if (report.report_target.profile) reported = report.report_target.profile;
  }

  return {
    report_id: report.report_id,
    reason: report.reason,
    status: report.status,
    created_at: report.created_at,
    resolved_at: report.resolved_at,
    reporter: toUserAccountDto(report.user),
    resolver: report.resolver ? toUserAccountDto(report.resolver) : null,
    reported,
  };
}