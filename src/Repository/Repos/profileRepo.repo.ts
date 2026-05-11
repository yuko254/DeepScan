import { Prisma, type profiles } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ProfileRepo extends BaseRepository<
  typeof prisma.profiles
> {
  constructor() {
    super(prisma.profiles, 'profiles', 'profile_id');
  }

  async findByUserId(user_id: string): Promise<profiles | null> {
    return prisma.profiles.findUnique({ where: { user_id } });
  }

  async findWithLocations(user_id: string): Promise<profiles | null> {
    return prisma.profiles.findUnique({
      where: { user_id },
      include: {
        birth_location_details: true,
        current_location_details: true,
      },
    });
  }
}
