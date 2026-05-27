import { scans } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ScanRepo extends BaseRepository<typeof prisma.scans> {
  constructor() {
    super(prisma.scans, 'scans', 'content_id');
  }

  private includeDetails = {
    content: { include: { user: { include: { profile: true } } } },
    location: { include: { city: true, country: true } },
  }

  async findScan(content_id: string) {
    return this.model.findUnique({
      where: { content_id },
      include: this.includeDetails
    });
  }

  async findUserScans(user_id: string, limit: number, cursor?: Date) {
    const scans = await this.model.findMany({
      where: {
        content: { user_id },
        ...(cursor && { content: { created_at: { lt: cursor } } })
      },
      include: this.includeDetails,
      orderBy: { content: { created_at: 'desc' } },
      take: limit
    });

    const nextCursor = scans.length === limit
      ? scans[scans.length - 1]?.content?.created_at
      : null;

    return { scans, nextCursor };
  }

  async createScan(data: Prisma.scansUncheckedCreateInput) {
    return this.model.create({ data, include: this.includeDetails });
  }

  async updateScan(data: Prisma.scansUncheckedUpdateInput) {
    return this.model.update({
      where: { content_id: data.content_id as string },
      data,
      include: this.includeDetails
    });
  }
}
