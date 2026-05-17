import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/client';
import * as zod from '../validations/validation.js';
import type * as Dto from "./dto.js";
import type * as prisma from "./prismaRes.dto.js";
import type { CityFiltersDto, CountryFiltersDto } from './searchFilters.dto.js';
import type { Countries, Cities, Locations } from '../graphql/graphql.js';


// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetLocationParam = z.object({
  location_id: zod.UUID,
});

export const CreateLocationSchema = z.object({
  country_id: z.bigint(),
  city_id: z.bigint().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  place_id: z.string().nullable(),

  location_id: z.undefined(),
});

const UpdateLocationSchema = z.object({
  country_id: z.bigint().optional(),
  city_id: z.bigint().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  place_id: z.string().nullable().optional(),

  location_id: z.undefined(),
});

export const UpsertLocationSchema = z.union([
  CreateLocationSchema,
  z.object({ location_id: zod.UUID }).and(UpdateLocationSchema.omit({ location_id: true })),
])

export const GetCountryParam = z.object({
  country_id: z.coerce.bigint()
});

export const GetCountriesQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  search: z.string().optional(),
}).transform(({ search, ...rest }) => ({
  ...rest,
  filters: { search } as CountryFiltersDto,
}));

export const CreateCountrySchema = z.object({
  name: z.string().max(255, 'Name must be at most 255 characters'),
  country_id: z.undefined(),
});

export const UpdateCountrySchema = z.object({
  name: z.string().max(255, 'Name must be at most 255 characters').optional(),
  country_id: z.undefined(),
});

export const GetCityParam = z.object({
  city_id: z.coerce.bigint()
});

export const GetCitiesQuerySchema = z.object({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  search: z.string().optional(),
  country_id: z.coerce.bigint().optional(),
}).transform(({ search, country_id, ...rest }) => ({
  ...rest,
  filters: { search, country_id } as CityFiltersDto,
}));

export const CreateCitySchema = z.object({
  name: z.string().max(255, 'Name must be at most 255 characters'),
  country_id: z.bigint({ message: 'country_id must be a valid bigint' }),
  city_id: z.undefined(),
});

export const UpdateCitySchema = z.object({
  name: z.string().max(255, 'Name must be at most 255 characters').optional(),
  country_id: z.bigint({ message: 'country_id must be a valid bigint' }).optional(),
  city_id: z.undefined(),
});

// ─── Inferred request types ───────────────────────────────────────────────────

export type CreateLocationBody = z.infer<typeof CreateLocationSchema>;
export type UpdateLocationBody = z.infer<typeof UpdateLocationSchema>;
export type UpsertLocationBody = z.infer<typeof UpsertLocationSchema>;

export type GetCountriesQuery = z.infer<typeof GetCountriesQuerySchema>;
export type CreateCountryBody = z.infer<typeof CreateCountrySchema>;
export type UpdateCountryBody = z.infer<typeof UpdateCountrySchema>;

export type GetCitiesQuery = z.infer<typeof GetCitiesQuerySchema>;
export type CreateCityBody = z.infer<typeof CreateCitySchema>;
export type UpdateCityBody = z.infer<typeof UpdateCitySchema>;

// ─── Response DTOs ────────────────────────────────────────────────────────────

export type CountryDto = Pick<Countries, 'country_id' | 'name'>;
export type CityDto = Pick<Cities, 'city_id' | 'name' | 'country_id'>;

export type LocationDto = Pick<Locations, 'location_id' | 'lat' | 'lng' | 'place_id'> & {
  city: CityDto | null;
  country: CountryDto;
};
export function toLocationDto(location: prisma.PrismaLocation): LocationDto {
  return {
    location_id: location.location_id,
    lat: location.lat instanceof Decimal ? location.lat.toNumber() : location.lat,
    lng: location.lng instanceof Decimal ? location.lng.toNumber() : location.lng,
    place_id: location.place_id,
    city: location.city ?? null,
    country: location.country,
  };
}

export interface CountriesPageDto {
  countries: CountryDto[];
  pagination: Dto.PageDto;
}

export interface CitiesPageDto {
  cities: CityDto[];
  pagination: Dto.PageDto;
}