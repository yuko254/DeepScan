import { countries } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CountryRepo extends BaseRepository<typeof prisma.countries> {
  constructor() {
    super(prisma.countries, 'countries', 'country_id');
  }

  async search(query: string) {
    return this.model.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'asc' },
      take: 20,
    });
  }

  async findAll() {
    return this.model.findMany({ orderBy: { name: 'asc' } });
  }

  async findWithCities(country_id: number) {
    return this.model.findUnique({
      where: { country_id },
      include: { cities: { orderBy: { name: 'asc' } } },
    });
  }
}
