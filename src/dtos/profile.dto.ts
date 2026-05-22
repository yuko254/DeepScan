import * as zod from '../validations/validation.js';
import { z } from 'zod';
import type * as prisma from "./prismaRes.dto.js";
import { CreateLocationSchema, UpsertLocationSchema, toLocationDto, type LocationDto } from './location.dto.js';
import type { Profiles } from '../graphql/graphql.js';

// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetProfileParam = z.strictObject({
  profile_id: zod.byId.uuid('profileId'),
});

export const CreateProfileSchema = z.strictObject({
  is_private: z.boolean().nullable(),
  bio: z.string().max(500, 'Bio can have at most 500 characters').nullable(),
  avatar: z.url("invalid URL").nullable(),
  first_name: z.string().max(50, "'first name must be at most 50 characters'"),
  last_name: z.string().max(50, "'last name must be at most 50 characters'"),
  phone_number: z.string().max(20, "'phone number must be at most 20 characters'").nullable(),
  birth_date: z.coerce.date("invalid date").nullable(),
  birth_location: CreateLocationSchema.nullable(),
  current_location: CreateLocationSchema.nullable(),
});

export const UpdateProfileSchema = z.strictObject({
  is_private: z.boolean().nullable().optional(),
  bio: z.string().max(500, 'Bio can have at most 500 characters').nullable().optional(),
  avatar: z.url("invalid URL").nullable().optional(),
  first_name: z.string().max(50, "'first name must be at most 50 characters'").optional(),
  last_name: z.string().max(50, "'last name must be at most 50 characters'").optional(),
  phone_number: z.string().max(20, "'phone number must be at most 20 characters'").nullable().optional(),
  birth_date: z.coerce.date("invalid date").nullable().optional(),
  birth_location: UpsertLocationSchema.nullable().optional(),
  current_location: UpsertLocationSchema.nullable().optional(),
});

export const UpsertProfileSchema = z.union([
  CreateProfileSchema,
  z.strictObject({ profile_id: zod.byId.uuid('profileId') }).and(UpdateProfileSchema),
]);

// ─── Inferred request types ───────────────────────────────────────────────────

export type CreateProfileBody = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileBody = z.infer<typeof UpdateProfileSchema>;
export type UpsertProfileBody = z.infer<typeof UpsertProfileSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type ProfileDto  = Pick<Profiles, 'profile_id' | 'is_private' | 'bio' | 'avatar' | 'first_name' | 'last_name' | 'phone_number' | 'birth_date' | 'created_at'> & {
  birth_location_details: LocationDto | null;
  current_location_details: LocationDto | null;
};
export function toProfileDto(profile: prisma.PrismaProfile): ProfileDto {
  return {
    profile_id: profile.profile_id,
    is_private: profile.is_private,
    bio: profile.bio,
    avatar: profile.avatar,
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone_number: profile.phone_number,
    birth_date: profile.birth_date,
    created_at: profile.created_at,
    birth_location_details: profile.birth_location_details
      ? toLocationDto(profile.birth_location_details)
      : null,
    current_location_details: profile.current_location_details
      ? toLocationDto(profile.current_location_details)
      : null,
  };
}