import { Prisma, prisma } from '../../config/prisma.js';
import { reportRepo, reportTargetRepo } from '../../Repository/instances.js';
import * as interactions from "../../validations/interactions.schema.js";
import * as AppError from '../../types/appErrors.types.js';

class ReportService {

<<<<<<< HEAD
  async getReport(userId: string, report_id: string) {
    const report = await reportRepo.findReport(report_id);
    if (!report) throw new AppError.NotFoundError('Report not found');
    if (report.reporter_id !== userId) throw new AppError.ForbiddenError("you can only view reports you own")
=======
  async validateReportAccess(reportOwnerId: string | null, currentUserId?: string) {
    const isOwner = currentUserId === reportOwnerId;
    if (!isOwner) throw new AppError.ForbiddenError("you can only view reports you own");
  }

  async getReport(report_id: string) {
    const report = await reportRepo.findReport(report_id);
    if (!report) throw new AppError.NotFoundError('Report not found');
>>>>>>> dev
    return report;
  }

  async getUserReports(userId: string, limit: number, cursor?: Date) {
<<<<<<< HEAD
    const reports = await prisma.reports.findMany({
      where: {
        reporter_id: userId,
        ...(cursor && { created_at: { lt: cursor } })
      },
      include: {
        user: true,
        resolver: true,
        report_target: {
          include: { post: true, comment: true, story: true, profile: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: limit
    });

    const nextCursor = reports.length === limit
      ? reports[reports.length - 1]?.created_at
      : null;

    return { reports, nextCursor };
  }

  async getReportsByUser(user_id: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      reportRepo.findMany({
        where: { reporter_id: user_id },
        include: {
          user: true,
          resolver: true,
          report_target: {
            include: {
              post: true,
              comment: true,
              story: true,
              profile: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      reportRepo.count({ where: { reporter_id: user_id } }),
    ]);
    return {
      reports,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createReport(user_id: string, type: string, input: interactions.ReportCreate, tx?: Prisma.TransactionClient) {
    const run = async (transaction: Prisma.TransactionClient) => {
      const targetRepo = reportTargetRepo.withTx(transaction);
=======
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
>>>>>>> dev
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

<<<<<<< HEAD
      const report = await reportRepo.withTx(transaction).create({
=======
      const report = await reportRepo.withTx(tx).create({
>>>>>>> dev
        data: {
          reporter_id: user_id,
          report_target_id: targetId,
          reason: input.reason ?? null,
          status: 'pending',
        },
<<<<<<< HEAD
        include: {
          user: true,
          resolver: true,
          report_target: {
            include: {
              post: true,
              comment: true,
              story: true,
              profile: true,
            },
          },
        },
      });
      return report;
    };

    if (tx) return run(tx);
    return prisma.$transaction(run);
=======
        include: { user: true, resolver: true, report_target: true }
      });

      return report;
    });
>>>>>>> dev
  }

  async deleteReport(report_id: string) {
    const deleted = await reportRepo.deleteById(report_id);
    if (!deleted) throw new AppError.NotFoundError('Report not found');
<<<<<<< HEAD
    return deleted;
=======
    return true;
>>>>>>> dev
  }
}

export const reportService = new ReportService()