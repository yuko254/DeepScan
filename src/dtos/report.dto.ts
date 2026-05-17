import { z } from 'zod';
import * as zod from "../validations/validation.js";
import type * as Dto from "./dto.js";
import type { ReportFiltersDto } from "./searchFilters.dto.js";
import type { Reports, Posts, Comments, Stories, Profiles } from '../graphql/graphql.js';
import type { UserAccountDto } from './users.dto.js';

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