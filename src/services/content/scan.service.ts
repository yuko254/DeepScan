import { Prisma, prisma } from '../../config/prisma.js';
import type { ScansCreateInput, ScansUpdateInput, ContentsCreateInput } from '../../graphql/generated/graphql.js';
import { scanRepo } from '../../Repository/instances.js';
import { locationService } from '../references/location.service.js';
import { contentService } from './content.service.js';
import * as AppError from '../../types/appErrors.types.js';


class ScanService {

  async getScan(scanId: string, userId: string) {
    const scan = await prisma.scans.findUnique({
      where: { content_id: scanId },
      include: {
        content: true,
        location: {
          include: {
            country: true,
            city: true
          }
        }
      }
    });

    if (!scan) throw new AppError.NotFoundError('Scan not found');
    if (scan.content.user_id !== userId) {
      throw new AppError.ForbiddenError('You can only view your own scans');
    }

    return { scan };
  }

  async getUserScans(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const scans = await prisma.scans.findMany({
      where: {
        content: {
          user_id: userId,
          is_deleted: false
        }
      },
      include: {
        content: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        },
        location: {
          include: {
            country: true,
            city: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { timestamp: 'desc' }
    });

    const total = await prisma.scans.count({
      where: {
        content: {
          user_id: userId,
          is_deleted: false
        }
      }
    });

    return { scans, total };
  }

  async createScan(
    contentId: string,
    input: ScansCreateInput,
    tx?: Prisma.TransactionClient
  ) {
    return (tx || prisma).$transaction(async (tx) => {
      let locationId = null;
      
      // Create location if provided
      if (input.location) {
        const location = await locationService.createLocation(input.location, tx);
        locationId = location.location_id;
      }

      // Create the scan (private by default)
      const scan = await scanRepo.withTx(tx).create({
        data: {
          content_id: contentId,
          location_id: locationId,
          metadata: input.metadata || {},
        }
      });

      return scan;
    });
  }

  async updateScan(
    userId: string,
    input: ScansUpdateInput,
    tx?: Prisma.TransactionClient
  ) {
    return (tx || prisma).$transaction(async (tx) => {
      // Verify ownership
      const existing = await tx.scans.findUnique({
        where: { content_id: input.content_id },
        include: { content: true }
      });

      if (!existing) throw new AppError.NotFoundError('Scan not found');
      if (existing.content.user_id !== userId) {
        throw new AppError.ForbiddenError('You can only update your own scans');
      }

      let locationId = undefined;
      
      // Handle location update
      if (input.location !== undefined) {
        if (input.location === null) {
          locationId = null;
        } else {
          const location = await locationService.createLocation(input.location, tx);
          locationId = location.location_id;
        }
      }

      const scan = await scanRepo.withTx(tx).update({
        where: { content_id: input.content_id },
        data: {
          location_id: locationId,
          metadata: input.metadata ?? undefined,
        }
      });

      return scan;
    });
  }

  async getScanCount(userId: string): Promise<number> {
    return await prisma.scans.count({
      where: {
        content: {
          user_id: userId,
          is_deleted: false
        }
      }
    });
  }

  async getRecentScans(userId: string, limit = 10) {
    const scans = await prisma.scans.findMany({
      where: {
        content: {
          user_id: userId,
          is_deleted: false
        }
      },
      include: {
        location: {
          include: {
            country: true,
            city: true
          }
        }
      },
      take: limit,
      orderBy: { timestamp: 'desc' }
    });

    return { scans };
  }
}

export const scanService = new ScanService();