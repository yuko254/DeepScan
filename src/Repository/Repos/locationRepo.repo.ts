import { Prisma, type locations } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class LocationRepo extends BaseRepository<
  typeof prisma.locations
> {
  constructor() {
    super(prisma.locations, 'locations', 'location_id');
  }

  async findByPlaceId(place_id: string): Promise<locations | null> {
    return prisma.locations.findFirst({ where: { place_id } });
  }
}
