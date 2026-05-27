import { Prisma, prisma } from '../../config/prisma.js';
import { scanRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as content from "../../validations/content.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { locationService } from '../references/location.service.js';

class ScanService {

  async getScan(userId: string, scanId: string, tx?: Prisma.TransactionClient) {
    const scan = await scanRepo.withTx(tx).findScan(scanId);
    if (!scan) throw new AppError.NotFoundError('Scan not found');

    if (scan.content.user_id !== userId && scan.content.visibility !== 'public')
      throw new AppError.ForbiddenError("You can't view this content");

    return scan;
  }

  async getUserScans(userId: string, limit: number, cursor?: Date) {
    return scanRepo.findUserScans(userId, limit, cursor);
  }

  async createScan(contentId: string, input: content.ScanCreate, tx?: Prisma.TransactionClient) {
    return (tx || prisma).$transaction(async (tx) => {
      const locationId = await locationService.resolveLocation(input.location, undefined, tx);

      const scan = await scanRepo.withTx(tx).createScan({
        content_id: contentId,
        location_id: locationId,
        metadata: input.metadata
      });

      return scan;
    });
  }

  async updateScan(userId: string, input: content.ScanUpdate, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getScan(input.content_id, userId, tx);

    return (tx || prisma).$transaction(async (tx) => {
      const existing = await this.getScan(input.content_id, userId, tx);
      if (!existing) throw new AppError.NotFoundError('Scan not found');
      if (existing.content.user_id !== userId) throw new AppError.ForbiddenError('You can only update your own scans');

      const { location, ...scan } = data

      const locationId = await locationService.resolveLocation(location, existing.location_id, tx);

      return await scanRepo.withTx(tx).updateScan({
        location_id: locationId,
        metadata: scan.metadata,
      });
    });
  }
}

export const scanService = new ScanService();