import { profiles } from "@prisma/client";
import { Prisma, prisma } from '../../config/prisma.js';
import { BaseRepository } from './BaseRepository.repo.js';

export class ProfileRepo extends BaseRepository<typeof prisma.profiles> {
  constructor() {
    super(prisma.profiles, 'profiles', 'profile_id');
  }
  private includeLocations = {
    birth_location: { include: { city: true, country: true } },
    current_location: { include: { city: true, country: true } },
  }

  async findProfile(where: Prisma.profilesWhereUniqueInput) {
    return this.model.findUnique({
      where,
      include: this.includeLocations
    });
  }

  async createProfile(data: Prisma.profilesUncheckedCreateInput) {
    return this.model.create({
      data,
      include: this.includeLocations
    });
  }

  async updateProfile(user_id: string, data: Prisma.profilesUncheckedUpdateInput) {
    return this.model.update({
      where: { user_id },
      data,
      include: this.includeLocations
    });
  }

  async deleteProfile(where: Prisma.profilesWhereUniqueInput) {
    return this.model.delete({
      where
    });
  }
}
