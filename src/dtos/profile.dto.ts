import * as zod from '../validations/common.validation.js';
import { z } from 'zod';
import { CreateLocationSchema, UpsertLocationSchema, type LocationDto } from './location.dto.js';


// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetProfileParam = z.object({
  profile_id: zod.UUID,
});

export const CreateProfileSchema = z.object({
  is_private: z.boolean().nullable(),
  bio: z.string().max(500, 'Bio can have at most 500 characters').nullable(),
  avatar: z.url("invalid URL").nullable(),
  first_name: z.string().max(50, "'first name must be at most 50 characters'"),
  last_name: z.string().max(50, "'last name must be at most 50 characters'"),
  phone_number: z.string().max(20, "'phone number must be at most 20 characters'").nullable(),
  birth_date: z.coerce.date("invalid date").nullable(),
  birth_location: CreateLocationSchema.nullable(),
  current_location: CreateLocationSchema.nullable(),
  
  profile_id: z.undefined(),
  user_id: z.undefined(),
  created_at: z.undefined(),
  birth_location_id: z.undefined(),
  current_location_id: z.undefined()
});

export const UpdateProfileSchema = z.object({
  is_private: z.boolean().nullable().optional(),
  bio: z.string().max(500, 'Bio can have at most 500 characters').nullable().optional(),
  avatar: z.url("invalid URL").nullable().optional(),
  first_name: z.string().max(50, "'first name must be at most 50 characters'").optional(),
  last_name: z.string().max(50, "'last name must be at most 50 characters'").optional(),
  phone_number: z.string().max(20, "'phone number must be at most 20 characters'").nullable().optional(),
  birth_date: z.coerce.date("invalid date").nullable().optional(),
  birth_location: UpsertLocationSchema.nullable().optional(),
  current_location: UpsertLocationSchema.nullable().optional(),

  profile_id: z.undefined(),
  user_id: z.undefined(),
  created_at: z.undefined(),
  birth_location_id: z.undefined(),
  current_location_id: z.undefined()
});

export const UpsertProfileSchema = z.union([
  CreateProfileSchema,
  z.object({ profile_id: zod.UUID }).and(UpdateProfileSchema.omit({ profile_id: true })),
]);

// ─── Inferred request types ───────────────────────────────────────────────────

export type CreateProfileBody = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileBody = z.infer<typeof UpdateProfileSchema>;
export type UpsertProfileBody = z.infer<typeof UpsertProfileSchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface ProfileDto {
  profile_id: string;
  is_private: boolean | null;
  bio: string | null;
  avatar: string | null;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  birth_date: Date | null;
  birth_location_details: LocationDto | null;
  current_location_details: LocationDto | null;
}