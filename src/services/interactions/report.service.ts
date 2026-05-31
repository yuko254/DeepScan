import { Prisma, prisma } from '../../config/prisma.js';
import { reportRepo, reportTargetRepo } from '../../Repository/instances.js';
import * as interactions from "../../validations/interactions.schema.js";
import * as AppError from '../../types/appErrors.types.js';

class ReportService {

  async validateReportAccess(reportOwnerId: string | null, currentUserId?: string) {
    const isOwner = currentUserId === reportOwnerId;
    if (!isOwner) throw new AppError.ForbiddenError("you can only view reports you own");
  }

  async getReport(report_id: string) {
    const report = await reportRepo.findReport(report_id);
    if (!report) throw new AppError.NotFoundError('Report not found');
    return report;
  }

  async getUserReports(userId: string, limit: number, cursor?: Date) {
    return reportRepo.findUserReports(userId, limit, cursor);
  }

  async getReportsPage(query: interactions.ReportsQuery) {
    const skip = (query.page - 1) * query.limit;
    const [reports, total] = await Promise.all([
      reportRepo.getPage(query.limit, skip, query.filters),
      reportRepo.countByFilter(query.filters),
    ]);

    return {
      reports: reports,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async getReportStats() {
    return reportRepo.countByStatus();
  }

  async createReport(user_id: string, type: string, input: interactions.ReportCreate, tx?: Prisma.TransactionClient) {

    return (tx || prisma).$transaction(async (tx) => {
      const targetRepo = reportTargetRepo.withTx(tx);
      let targetId: string;

      if (type === 'post') {
        const target = await targetRepo.findOrCreateForPost(input.report_target_id);
        targetId = target.target_id;
      } else if (type === 'comment') {
        const target = await targetRepo.findOrCreateForComment(input.report_target_id);
        targetId = target.target_id;
      } else if (type === 'story') {
        const target = await targetRepo.findOrCreateForStory(input.report_target_id);
        targetId = target.target_id;
      } else if (type === 'profile') {
        const target = await targetRepo.findOrCreateForProfile(input.report_target_id);
        targetId = target.target_id;
      } else {
        throw new AppError.BadRequestError('Report target must specify one of: post, comment, story, or profile');
      }

      const report = await reportRepo.withTx(tx).create({
        data: {
          reporter_id: user_id,
          report_target_id: targetId,
          reason: input.reason ?? null,
          status: 'pending',
        },
        include: { user: true, resolver: true, report_target: true }
      });

      return report;
    });
  }

  async deleteReport(report_id: string) {
    const deleted = await reportRepo.deleteById(report_id);
    if (!deleted) throw new AppError.NotFoundError('Report not found');
    return true;
  }
}

export const reportService = new ReportService()