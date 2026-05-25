import * as prisma from "./prismaRes.dto.js";
import {toLocationDto, LocationDto } from './location.dto.js';
import { Profiles } from '../graphql/generated/graphql.js';

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