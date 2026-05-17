import { type scans } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

// NOTE: schema model is 'scans' (nested under contents), not 'scan_history'
export class ScanRepo extends BaseRepository<typeof prisma.scans> {
  constructor() {
    super(prisma.scans, 'scans', 'content_id');
  }

  async findByUser(user_id: string) {
    return this.model.findMany({
      where: { content: { user_id } },
      include: { content: { include: { media: true } }, location: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  async findWithDetails(content_id: string) {
    return this.model.findUnique({
      where: { content_id },
      include: {
        content: { include: { media: true, user: { include: { profile: true } } } },
        location: { include: { city: true, country: true } },
      },
    });
  }

  async findWithLocation(content_id: string) {
    return this.model.findUnique({
      where: { content_id },
      include: { location: true },
    });
  }
}
