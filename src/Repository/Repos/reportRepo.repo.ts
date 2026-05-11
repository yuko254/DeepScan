import { Prisma, type reports } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ReportRepo extends BaseRepository<
  typeof prisma.reports
> {
  constructor() {
    super(prisma.reports, 'reports', 'report_id');
  }

  async findByReporter(reporter_id: string): Promise<reports[]> {
    return prisma.reports.findMany({
      where: { reporter_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByItem(reported_item_id: string, item_type: string): Promise<reports[]> {
    return prisma.reports.findMany({ where: { reported_item_id, item_type } });
  }

  async findByStatus(status: string): Promise<reports[]> {
    return prisma.reports.findMany({
      where: { status },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(report_id: string, status: string): Promise<reports> {
    return prisma.reports.update({ where: { report_id }, data: { status } });
  }
}
