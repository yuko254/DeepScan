import { Prisma, prisma } from "../config/prisma.js";
import { profileRepo } from '../Repository/instances.js';
import * as profile from "../dtos/profile.dto.js";
import * as location from "../dtos/location.dto.js"
import * as AppError from '../types/appErrors.types.js';
import { deepClean } from "../dtos/common.dto.js";
import { LocationService } from "./location.service.js";


const locationService = new LocationService()

export class ProfileService {
  constructor() { }

  async getProfile(ids: { userID?: string; profileID?: string }): Promise<profile.ProfileDto> {
    const { userID, profileID } = ids;
    if (!userID && !profileID)
      throw new AppError.BadRequestError('either userID or profileID is required');

    const res = await profileRepo.findUnique({
      where: profileID && userID
        ? { profile_id: profileID, user_id: userID }
        : profileID
          ? { profile_id: profileID }
          : { user_id: userID },
      include: {
        birth_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
        current_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
      },
      omit: {
        user_id: true, birth_location_id: true, current_location_id: true, created_at: true
      },
    });

    if (!res) throw new AppError.NotFoundError('Profile not found');
    return res;
  }

  async createProfile(userID: string, input: profile.CreateProfileBody, tx?: Prisma.TransactionClient): Promise<profile.ProfileDto> {
    const { birth_location, current_location, ...profile } = deepClean(input);

    const run = async (tx: Prisma.TransactionClient) => {
      const [birthLocationId, currentLocationId] = await Promise.all([
        this.resolveLocation(birth_location, tx),
        this.resolveLocation(current_location, tx),
      ]);

      return await profileRepo.withTx(tx).create({
        data: {
          user_id: userID,
          ...profile,
          birth_location_id: birthLocationId,
          current_location_id: currentLocationId,
        },
        include: {
          birth_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
          current_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
        },
        omit: {
          user_id: true, birth_location_id: true, current_location_id: true, created_at: true
        },
      });
    }

    return await (tx ? run(tx) : prisma.$transaction(run)).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Profile already exists');
        if (e.code === 'P2003') throw new AppError.ValidationError('Invalid user or location reference');
        if (e.code === 'P2025') throw new AppError.NotFoundError('User not found');
      }
      throw e;
    })
  }

  async updateProfile(input: profile.UpdateProfileBody, ids: { userID?: string; profileID?: string }, tx?: Prisma.TransactionClient): Promise<profile.ProfileDto> {
    const { userID, profileID } = ids;
    const { birth_location, current_location, ...profile } = deepClean(input);
    if (!userID && !profileID)
      throw new AppError.BadRequestError('either userID or profileID is required');

    const run = async (tx: Prisma.TransactionClient) => {
      const [birthLocationId, currentLocationId] = await Promise.all([
        this.resolveLocation(birth_location, tx),
        this.resolveLocation(current_location, tx),
      ]);

      return await profileRepo.withTx(tx).update({
        where: profileID && userID
          ? { profile_id: profileID, user_id: userID }
          : profileID
            ? { profile_id: profileID }
            : { user_id: userID },
        data: {
          ...profile,
          birth_location_id: birthLocationId,
          current_location_id: currentLocationId,
        },
        include: {
          birth_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
          current_location_details: { include: { city: true, country: true }, omit: { city_id: true, country_id: true } },
        },
        omit: {
          user_id: true, birth_location_id: true, current_location_id: true, created_at: true
        },
      });
    }

    return await (tx ? run(tx) : prisma.$transaction(run)).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('Profile already exists');
        if (e.code === 'P2003') throw new AppError.ValidationError('Invalid location reference');
        if (e.code === 'P2025') throw new AppError.NotFoundError('Profile not found');
      }
      throw e;
    })
  }

  async deleteProfile(ids: { userID?: string; profileID?: string }, tx?: Prisma.TransactionClient): Promise<void> {
    const { userID, profileID } = ids;
    if (!userID && !profileID)
      throw new AppError.BadRequestError('either userID or profileID is required');

    await profileRepo.withTx(tx).delete({
      where: profileID && userID
        ? { profile_id: profileID, user_id: userID }
        : profileID
          ? { profile_id: profileID }
          : { user_id: userID },
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025') throw new AppError.NotFoundError('Profile not found');
      throw e;
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────────

  private resolveLocation(input: location.UpsertLocationBody | null | undefined, tx?: Prisma.TransactionClient) {
    if (!input) return Promise.resolve(undefined);
    if ("location_id" in input && input.location_id) {
      const { location_id, ...rest } = input;
      return locationService.updateLocation(location_id, rest as location.UpdateLocationBody, tx).then(l => l.location_id);
    }
    return locationService.createLocation(input as location.CreateLocationBody, tx).then(l => l.location_id);
  }
}
