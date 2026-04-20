import { Prisma, type locations } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class LocationDao extends BaseDao<
  locations,
  Prisma.locationsCreateInput,
  Prisma.locationsUpdateInput,
  Prisma.locationsWhereUniqueInput
> {
  constructor() {
    super(prisma.locations);
  }

  async findByPlaceId(place_id: string): Promise<locations | null> {
    return prisma.locations.findFirst({ where: { place_id } });
  }

  async findOrCreate(data: Prisma.locationsCreateInput): Promise<locations> {
    if (data.place_id) {
      const existing = await this.findByPlaceId(data.place_id as string);
      if (existing) return existing;
    }
    return prisma.locations.create({ data });
  }

  async search(query: string): Promise<locations[]> {
    return prisma.locations.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 20,
    });
  }
}
