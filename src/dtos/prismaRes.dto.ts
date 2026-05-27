import type { roles, users, profiles, locations, cities, countries } from '@prisma/client';

export type PrismaLocation = locations & {
  city: cities | null;
  country: countries;
};

export type PrismaProfile = profiles & {
  birth_location: PrismaLocation | null;
  current_location: PrismaLocation | null;
};

export type PrismaRole = roles;

export type PrismaUserAccount = users & { role: roles | null };

export type PrismaUser = PrismaUserAccount & { profile: PrismaProfile | null | undefined; };

