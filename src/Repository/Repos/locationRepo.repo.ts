import { type locations } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class LocationRepo extends BaseRepository<typeof prisma.locations> {
  constructor() {
    super(prisma.locations, 'locations', 'location_id');
  }

  async findByPlaceId(place_id: string): Promise<locations | null> {
    return prisma.locations.findFirst({ where: { place_id } });
  }

  async findWithDetails(location_id: string): Promise<locations | null> {
    return prisma.locations.findUnique({
      where: { location_id },
      include: { country: true, city: true },
    });
  }

  async findByCountry(country_id: bigint): Promise<locations[]> {
    return prisma.locations.findMany({ where: { country_id } });
  }

  async findByCity(city_id: bigint): Promise<locations[]> {
    return prisma.locations.findMany({ where: { city_id } });
  }
}
