import { type locations } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class LocationRepo extends BaseRepository<typeof prisma.locations> {
  constructor() {
    super(prisma.locations, 'locations', 'location_id');
  }

  async findByPlaceId(place_id: string) {
    return this.model.findFirst({ where: { place_id } });
  }

  async findWithDetails(location_id: string) {
    return this.model.findUnique({
      where: { location_id },
      include: { country: true, city: true },
    });
  }

  async findByCountry(country_id: number) {
    return this.model.findMany({ where: { country_id } });
  }

  async findByCity(city_id: number) {
    return this.model.findMany({ where: { city_id } });
  }
}
