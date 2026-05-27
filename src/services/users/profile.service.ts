import { Prisma, prisma } from "../../config/prisma.js";
import { profileRepo } from '../../Repository/instances.js';
import { deepClean } from "../../dtos/dto.js";
import * as user from "../../validations/user.schema.js";
import * as AppError from '../../types/appErrors.types.js';
import { locationService } from "../references/location.service.js";

class ProfileService {

  async getProfile(ids: { userId?: string; profileId?: string }, tx?: Prisma.TransactionClient) {
    const where = this.resolveWhereID(ids);
    const profile = await profileRepo.withTx(tx).findProfile(where);
    if (!profile) throw new AppError.NotFoundError('Profile not found');
    return profile;
  }

  async getPublicProfile(viewerId: string | undefined, targetUserId: string, tx?: Prisma.TransactionClient) {
    const profile = await this.getProfile({ userId: targetUserId }, tx);

    if (profile.is_private && viewerId !== targetUserId) {
      return {
        ...profile,
        bio: undefined,
        phone_number: undefined,
        birth_date: undefined,
        birth_location: undefined,
        current_location: undefined,
      };
    }

    return profile;
  }

  async createProfile(userId: string, input: user.ProfileCreate, tx?: Prisma.TransactionClient) {
    const { birth_location, current_location, ...profile } = deepClean(input);

    return await (tx || prisma).$transaction(async (tx) => {
      const [birthLocationId, currentLocationId] = await Promise.all([
        locationService.resolveLocation(birth_location, undefined, tx),
        locationService.resolveLocation(current_location, undefined, tx),
      ]);

      return await profileRepo.withTx(tx).createProfile({
        user_id: userId,
        ...profile,
        birth_location_id: birthLocationId,
        current_location_id: currentLocationId,
      });
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Profile already exists');
        if (e.code === 'P2003') throw new AppError.NotFoundError('User or location does not exist');
      }
      throw e;
    });
  }

  async updateProfile(userId: string, input: user.ProfileUpdate, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getProfile({ userId }, tx);

    return await (tx || prisma).$transaction(async (tx) => {
      const existing = await this.getProfile({ userId }, tx);
      if (!existing) throw new AppError.NotFoundError('profile not found');

      const { birth_location, current_location, ...profile } = data;

      const [birthLocationId, currentLocationId] = await Promise.all([
        locationService.resolveLocation(birth_location, existing.birth_location_id, tx),
        locationService.resolveLocation(current_location, existing.current_location_id, tx),
      ]);

      return await profileRepo.withTx(tx).updateProfile(userId, {
        ...profile,
        profile_id: existing.profile_id,
        birth_location_id: birthLocationId,
        current_location_id: currentLocationId,
      });
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Profile already exists');
        if (e.code === 'P2003') throw new AppError.NotFoundError('Location not found');
        if (e.code === 'P2025') throw new AppError.NotFoundError('Profile not found');
      }
      throw e;
    });
  }

  async deleteProfile(ids: { userId?: string; profileId?: string }, tx?: Prisma.TransactionClient) {
    const where = this.resolveWhereID(ids);
    await profileRepo.withTx(tx).deleteProfile(where)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') throw new AppError.NotFoundError('Profile not found');
        }
        throw e;
      });
  }

  async resolveProfile(userId: string, input?: user.ProfileUpsert | null, existingProfileId?: string | null, tx?: Prisma.TransactionClient) {
    if (input === undefined) return undefined;

    if (input === null) {
      if (existingProfileId) await this.deleteProfile({ profileId: existingProfileId }, tx);
      return null;
    }

    if (!("profile_id" in input)) {
      return await this.createProfile(userId, input, tx);
    }

    return await this.updateProfile(userId, input, tx);
  }
  
  // ─── Helpers ─────────────────────────────────────────────────────────────────────

  private resolveWhereID(ids: { userId?: string; profileId?: string }) {
    const { userId, profileId } = ids;
    if (!userId && !profileId) throw new AppError.BadRequestError('either userId or profileId is required');
    return userId && profileId
      ? { profile_id: profileId, user_id: userId }
      : profileId
        ? { profile_id: profileId }
        : { user_id: userId };
  }
}

export const profileService = new ProfileService();