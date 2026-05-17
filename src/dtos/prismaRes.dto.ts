import type { roles, users, profiles, locations, cities, countries } from '@prisma/client';

export type PrismaLocation = locations & {
  city: cities | null;
  country: countries;
};

export type PrismaProfile = profiles & {
  birth_location_details: PrismaLocation | null;
  current_location_details: PrismaLocation | null;
};

export type PrismaRole = roles;

export type PrismaUserAccount = users & { role: roles | null };

export type PrismaUser = PrismaUserAccount & { profile: PrismaProfile | null; };

