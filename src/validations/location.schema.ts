import { z } from 'zod';
import { IdSchema } from './fields/common.fields.js';
import * as pagination from './fields/pagination.fields.js';

// ─── Country ───
export const CountryCreateSchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters'),
});

export const CountryUpdateSchema = CountryCreateSchema.partial().extend({
  country_id: IdSchema.number('countryId')
});

export const CountryUpsertSchema = z.union([
  CountryCreateSchema,
  CountryUpdateSchema,
]);

// ─── City ───
export const CityCreateSchema = z.strictObject({
  name: z.string().max(255, 'Name must be at most 255 characters'),
  country_id: IdSchema.number('countryId'),
});

export const CityUpdateSchema = CityCreateSchema.partial().extend({
  city_id: IdSchema.number('cityId'),
});

export const CityUpsertSchema = z.union([
  CityCreateSchema,
  CityUpdateSchema,
]);

// ─── Location ───
export const LocationCreateSchema = z.strictObject({
  country_id: IdSchema.number('countryId'),
  city_id: IdSchema.number('cityId').nullable(),
  lat: z.coerce.number().nullable(),
  lng: z.coerce.number().nullable(),
  place_id: z.string().nullable(),
});

export const LocationUpdateSchema = LocationCreateSchema.partial().extend({
  location_id: IdSchema.uuid('locationId'),
});

export const LocationUpsertSchema = z.union([
  LocationCreateSchema,
  LocationUpdateSchema,
]);

// ─── Types ───
export type CountryCreate = z.infer<typeof CountryCreateSchema>;
export type CountryUpdate = z.infer<typeof CountryUpdateSchema>;
export type CountryUpsert = z.infer<typeof CountryUpsertSchema>;

export type CityCreate = z.infer<typeof CityCreateSchema>;
export type CityUpdate = z.infer<typeof CityUpdateSchema>;
export type CityUpsert = z.infer<typeof CityUpsertSchema>;

export type LocationCreate = z.infer<typeof LocationCreateSchema>;
export type LocationUpdate = z.infer<typeof LocationUpdateSchema>;
export type LocationUpsert = z.infer<typeof LocationUpsertSchema>;