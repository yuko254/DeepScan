import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/client';
import * as zod from '../validations/validation.js';
import type * as Dto from "./dto.js";
import type * as prisma from "./prismaRes.dto.js";
import type { CityFiltersDto, CountryFiltersDto } from './searchFilters.dto.js';
import type { Countries, Cities, Locations } from '../graphql/graphql.js';
import type { cities, countries } from '@prisma/client';


// ─── Request schemas ──────────────────────────────────────────────────────────

export const GetLocationParam = z.strictObject({
  location_id: zod.UUID,
});

export const CreateLocationSchema = z.strictObject({
  country_id: zod.ID,
  city_id: zod.ID.nullable(),
  lat: z.coerce.number().nullable(),
  lng: z.coerce.number().nullable(),
  place_id: z.string().nullable(),
});

const UpdateLocationSchema = z.strictObject({
  country_id: zod.ID.optional(),
  city_id: zod.ID.nullable().optional(),
  lat: z.coerce.number().nullable().optional(),
  lng: z.coerce.number().nullable().optional(),
  place_id: z.string().nullable().optional(),
});

export const UpsertLocationSchema = z.union([
  CreateLocationSchema,
  z.strictObject({ location_id: zod.UUID }).and(UpdateLocationSchema),
])

export const GetCountryParam = z.strictObject({
  country_id: zod.ID
});

export const GetCountriesQuerySchema = z.strictObject({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  search: z.string().optional(),
}).transform(({ search, ...rest }) => ({
  ...rest,
  filters: { search } as CountryFiltersDto,
}));

export const CreateCountrySchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters'),
});

export const UpdateCountrySchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters').optional(),
});

export const GetCityParam = z.strictObject({
  city_id: zod.ID
});

export const GetCitiesQuerySchema = z.strictObject({
  page: zod.pageQuery,
  limit: zod.pageLimitQuery,
  search: z.string().optional(),
  country_id: zod.ID.optional(),
}).transform(({ search, country_id, ...rest }) => ({
  ...rest,
  filters: { search, country_id } as CityFiltersDto,
}));

export const CreateCitySchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters'),
  country_id: zod.ID,
});

export const UpdateCitySchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters').optional(),
  country_id: zod.ID.optional(),
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
export function toCountryDto(country: countries): CountryDto {
  return {
    country_id: country.country_id,
    name: country.name
  };
}

export type CityDto = Pick<Cities, 'city_id' | 'name' | 'country_id'>;
export function toCityDto(city: cities): CityDto {
  return {
    city_id: city.city_id,
    name: city.name,
    country_id: city.country_id
  };
}

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
    city: location.city ? toCityDto(location.city) : null,
    country: toCountryDto(location.country),
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