import { Decimal } from '@prisma/client/runtime/client';
import * as Dto from "../dtos/dto.js";
import * as prisma from "../dtos/prismaRes.dto.js";
import type { Countries, Cities, Locations } from '../graphql/generated/graphql.js';
import type { cities, countries } from '@prisma/client';


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