import * as prisma from "./prismaRes.dto.js";
import {toLocationDto, LocationDto } from './location.dto.js';
import { Profiles } from '../graphql/generated/graphql.js';

export type ProfileDto  = Pick<Profiles, 'profile_id' | 'is_private' | 'bio' | 'avatar' | 'first_name' | 'last_name' | 'phone_number' | 'birth_date' | 'created_at'> & {
  birth_location: LocationDto | null;
  current_location: LocationDto | null;
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
    birth_location: profile.birth_location
      ? toLocationDto(profile.birth_location)
      : null,
    current_location: profile.current_location
      ? toLocationDto(profile.current_location)
      : null,
  };
}