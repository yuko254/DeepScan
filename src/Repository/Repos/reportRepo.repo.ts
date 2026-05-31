import { ReportStatus } from "@prisma/client";
<<<<<<< HEAD
import { prisma } from '../../config/prisma.js';
=======
import { Prisma, prisma } from '../../config/prisma.js';
>>>>>>> dev
import { BaseRepository } from './BaseRepository.repo.js';
import { reportFilterMapping, type ReportFiltersDto } from "../../dtos/searchFilters.dto.js";

export class ReportRepo extends BaseRepository<typeof prisma.reports> {
  protected filterMapping = reportFilterMapping;

  constructor() {
    super(prisma.reports, 'reports', 'report_id');
  }

  private includeDetails = {
<<<<<<< HEAD
    user: true,                     // reporter
    resolver: true,                 // moderator
    report_target: {
      include: {
        post: true,                 // full post if target is a post
        comment: true,              // full comment
        story: true,                // full story
        profile: true,              // full profile
      },
    },
  }

  async findReport(report_id: string) {
    return await this.model.findUnique({
=======
    reporter: { include: { profile: true } },
    resolver: { include: { profile: true } },
    report_target: true
  }

  async findReport(report_id: string) {
    return this.model.findUnique({
>>>>>>> dev
      where: { report_id },
      include: this.includeDetails
    });
  }

<<<<<<< HEAD
  async getPage(take: number, skip: number, filters?: ReportFiltersDto) {
    const where = this.buildWhere(filters);
    return await this.model.findMany({
      take,
      skip,
      where,
      include: { user: true, resolver: true, report_target: true },
=======
  async findUserReports(user_id: string, limit: number, cursor?: Date) {
    const where: Prisma.reportsWhereInput = {
      reporter_id: user_id,
      ...(cursor && { created_at: { lt: cursor } })
    };

    const reports = await this.model.findMany({
      take: limit,
      where,
      include: this.includeDetails,
      orderBy: { created_at: 'desc' },
    });

    const nextCursor = reports.length === limit
      ? reports[reports.length - 1]?.created_at
      : null;

    return { reports, nextCursor };
  }

  async getPage(take: number, skip: number, filters?: ReportFiltersDto) {
    const where = this.buildWhere(filters);
    return this.model.findMany({
      take,
      skip,
      where,
      include: this.includeDetails,
>>>>>>> dev
      orderBy: { created_at: 'desc' },
    });
  }


  async countByFilter(filters?: ReportFiltersDto) {
    return this.model.count({ where: this.buildWhere(filters) });
  }

  async resolve(report_id: string, resolver_id: string, status: ReportStatus) {
    return this.model.update({
      where: { report_id },
      data: { status, resolver_id, resolved_at: new Date() },
      include: this.includeDetails
    });
  }

  async countByStatus() {
    const rows = await this.model.groupBy({ by: ['status'], _count: true });
    const result = {} as Record<ReportStatus, number>;
    for (const r of rows) result[r.status] = r._count;
    return result;
  }
}