import { type reports, ReportStatus, Prisma } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ReportRepo extends BaseRepository<typeof prisma.reports> {
  constructor() {
    super(prisma.reports, 'reports', 'report_id');
  }

  async findByReporter(reporter_id: string): Promise<reports[]> {
    return prisma.reports.findMany({
      where: { reporter_id },
      include: { report_target: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByStatus(status: ReportStatus): Promise<reports[]> {
    return prisma.reports.findMany({
      where: { status },
      include: { report_target: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findPending(): Promise<reports[]> {
    return this.findByStatus(ReportStatus.pending);
  }

  async resolve(report_id: string, resolver_id: string, status: ReportStatus): Promise<reports> {
    return prisma.reports.update({
      where: { report_id },
      data: { status, resolver_id, resolved_at: new Date() },
    });
  }

  async countByStatus(): Promise<Record<ReportStatus, number>> {
    const rows = await prisma.reports.groupBy({ by: ['status'], _count: true });
    const result = {} as Record<ReportStatus, number>;
    for (const r of rows) result[r.status] = r._count;
    return result;
  }
}
