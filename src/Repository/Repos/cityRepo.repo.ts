import { type cities } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CityRepo extends BaseRepository<typeof prisma.cities> {
  constructor() {
    super(prisma.cities, 'cities', 'city_id');
  }

  async search(query: string) {
    return this.model.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'asc' }, // fix: was 'desc'
      take: 20,
    });
  }

  async findByCountry(country_id: number) {
    return this.model.findMany({
      where: { country_id },
      orderBy: { name: 'asc' },
    });
  }

  async findByNameAndCountry(name: string, country_id: number) {
    return this.model.findUnique({ where: { name_country_id: { name, country_id } } });
  }
}
