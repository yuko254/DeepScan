import { Prisma, type reports } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class ReportDao extends BaseDao<
  reports,
  Prisma.reportsCreateInput,
  Prisma.reportsUpdateInput,
  Prisma.reportsWhereUniqueInput
> {
  constructor() {
    super(prisma.reports);
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
