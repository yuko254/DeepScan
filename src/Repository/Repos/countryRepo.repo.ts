import { Prisma, type countries } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class CountryRepo extends BaseRepository<
  typeof prisma.countries
> {
  constructor() {
    super(prisma.countries, 'countries', 'country_id');
  }

  async search(query: string): Promise<countries[]> {
    return prisma.countries.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      orderBy: { name: 'desc' },
      take: 20,
    });
  }

}
