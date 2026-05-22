import type { Resolvers, MutationCreateReportArgs, MutationDeleteReportArgs, Users } from '../graphql.js';
import type { Request } from 'express';
import type { PrismaClient } from '@prisma/client';
import { ReportService } from '../../services/report.service.js';

type GraphQLContext = { req: Request; user?: Users | null; prisma: PrismaClient };

const reportService = new ReportService();

export const reportResolvers: Partial<Resolvers<GraphQLContext>> = {
  Query: {},
  Mutation: {
    createReport: async (_parent, args: MutationCreateReportArgs, ctx) => {
      const userId = ctx.req?.user?.user_id ?? ctx.user?.user_id;
      return await reportService.createReport({ ...(args.data as unknown as Record<string, unknown>), user_id: userId });
    },
    deleteReport: async (_parent, args: MutationDeleteReportArgs, _ctx) => {
      return await reportService.deleteReport(args.id);
    },
  },
  reports: {},
};