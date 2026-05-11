import { Prisma, type cities } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CityRepo extends BaseRepository<
  typeof prisma.cities
> {
  constructor() {
    super(prisma.cities, 'cities', 'city_id');
  }

  async search(query: string): Promise<cities[]> {
    return prisma.cities.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'desc' },
      take: 20,
    });
  }

}
