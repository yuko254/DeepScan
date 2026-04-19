import { Prisma, type scan_history } from '../orm/prisma/client.js';
import { prisma } from '../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class ScanHistoryDao extends BaseDao<
  scan_history,
  Prisma.scan_historyCreateInput,
  Prisma.scan_historyUpdateInput,
  Prisma.scan_historyWhereUniqueInput
> {
  constructor() {
    super(prisma.scan_history);
  }

  async findByUser(user_id: string): Promise<scan_history[]> {
    return prisma.scan_history.findMany({
      where: { user_id },
      include: { media: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findWithMedia(scan_id: string): Promise<scan_history | null> {
    return prisma.scan_history.findUnique({
      where: { scan_id },
      include: { media: true },
    });
  }
}
