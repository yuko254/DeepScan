import { Prisma, type scan_history } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ScanHistoryRepo extends BaseRepository<
  typeof prisma.scan_history
> {
  constructor() {
    super(prisma.scan_history, 'scan_history', 'scan_id');
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
