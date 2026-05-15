import { type profiles } from "@prisma/client";
import { prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ProfileRepo extends BaseRepository<typeof prisma.profiles> {
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
        birth_location_details: { include: { city: true, country: true } },
        current_location_details: { include: { city: true, country: true } },
      },
    });
  }

  async updateAvatar(user_id: string, avatar: string): Promise<profiles> {
    return prisma.profiles.update({ where: { user_id }, data: { avatar } });
  }

  async search(query: string): Promise<profiles[]> {
    return prisma.profiles.findMany({
      where: {
        OR: [
          { first_name: { contains: query, mode: 'insensitive' } },
          { last_name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
}
