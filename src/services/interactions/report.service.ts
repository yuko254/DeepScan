import { Prisma, prisma } from '../../config/prisma.js';
import type { ReportsCreateInput } from '../../graphql/generated/graphql.js';
import { reportRepo, reportTargetRepo } from '../../Repository/instances.js';
import * as AppError from '../../types/appErrors.types.js';

export class ReportService {

  async createReport(
    reporter_id: string,
    input: ReportsCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    const run = async (transaction: Prisma.TransactionClient) => {
      const targetRepo = reportTargetRepo.withTx(transaction);
      let targetId: string;

      if (input.report_target?.post_id) {
        const target = await targetRepo.findOrCreateForPost(input.report_target.post_id);
        targetId = target.target_id;
      } else if (input.report_target?.comment_id) {
        const target = await targetRepo.findOrCreateForComment(input.report_target.comment_id);
        targetId = target.target_id;
      } else if (input.report_target?.story_id) {
        const target = await targetRepo.findOrCreateForStory(input.report_target.story_id);
        targetId = target.target_id;
      } else if (input.report_target?.profile_id) {
        const target = await targetRepo.findOrCreateForProfile(input.report_target.profile_id);
        targetId = target.target_id;
      } else {
        throw new AppError.BadRequestError('Report target must specify one of: post_id, comment_id, story_id, or profile_id');
      }

      const report = await reportRepo.withTx(transaction).create({
        data: {
          reporter_id,
          report_target_id: targetId,
          reason: input.reason ?? null,
          status: 'pending',
        },
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
  }

  async getReport(userID: string, report_id: string) {
    const report = await reportRepo.findReport(report_id);
    if (!report) throw new AppError.NotFoundError('Report not found');
    if (report.reporter_id !== userID) throw new AppError.ForbiddenError("you can only view reports you own")
    return report;
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

  async deleteReport(report_id: string) {
    const deleted = await reportRepo.deleteById(report_id);
    if (!deleted) throw new AppError.NotFoundError('Report not found');
    return deleted;
  }
}

export const reportService = new ReportService()