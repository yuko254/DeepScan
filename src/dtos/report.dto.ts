import * as Dto from "./dto.js";
import { Reports, Posts, Comments, Stories, Profiles } from '../graphql/generated/graphql.js';
import  { UserAccountDto, toUserAccountDto } from './user.dto.js';

export interface TargetSummary {
  target_id: string | null;
  type: 'post' | 'comment' | 'story' | 'profile' | null;
  entityId: string | null;
}

export type ReportListItem = Pick<
  Reports,
  'report_id' | 'reason' | 'status' | 'created_at' | 'resolved_at'
> & {
  reporter: UserAccountDto;
  resolver: UserAccountDto | null;
  target: TargetSummary;
};

export type ReportDto = Pick<
  Reports,
  'report_id' | 'reason' | 'status' | 'created_at' | 'resolved_at'
> & {
  reporter: UserAccountDto;
  resolver: UserAccountDto | null;
  reported: Posts | Comments | Stories | Profiles | null;
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