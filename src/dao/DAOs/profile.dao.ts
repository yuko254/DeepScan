import { Prisma, type profiles } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseDao } from './base.dao.js';

export class ProfileDao extends BaseDao<
  profiles,
  Prisma.profilesCreateInput,
  Prisma.profilesUpdateInput,
  Prisma.profilesWhereUniqueInput
> {
  constructor() {
    super(prisma.profiles);
  }

  async findByUserId(user_id: string): Promise<profiles | null> {
    return prisma.profiles.findUnique({ where: { user_id } });
  }

  async findWithLocations(user_id: string): Promise<profiles | null> {
    return prisma.profiles.findUnique({
      where: { user_id },
      include: {
        locations_profiles_birth_locationTolocations: true,
        locations_profiles_current_locationTolocations: true,
      },
    });
  }
}
