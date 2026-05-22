import { Prisma } from "../../config/prisma.js";

import { locationRepo, cityRepo, countryRepo } from "../../Repository/instances.js";
import { deepClean } from "../../dtos/dto.js";

import * as location from "../../dtos/location.dto.js"
import * as AppError from '../../types/appErrors.types.js';

export class LocationService {

  // ─── Location ──────────────────────────────────────────────────────────────────

  async getLocation(locationID: string, tx?: Prisma.TransactionClient) {
    const location = await locationRepo.withTx(tx).findWithDetails(locationID);
    if (!location) throw new AppError.NotFoundError('Location not found');
    return location;
  }

  async createLocation(input: location.CreateLocationBody, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    const { city_id, country_id, ...location } = data;
    if (city_id) await this.checkCityCountry(city_id, country_id, tx);

    return await locationRepo.withTx(tx).create({
      data: {
        ...location,
        country: { connect: { country_id: country_id } },
        city: city_id ? { connect: { city_id: city_id } } : undefined,
      },
      include: { city: true, country: true },
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') throw new AppError.NotFoundError("couldn't find specified country (or city) ID");
      }
      throw e;
    })
  }

  async updateLocation(locationID: string, input: location.UpdateLocationBody, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0)
      return this.getLocation(locationID, tx);

    let { city_id, country_id, ...location } = data

    if (city_id) {
      if (!country_id) {
        const existingLocation = await locationRepo.withTx(tx).findUnique({
          where: { location_id: locationID },
          select: { country_id: true }
        });
        if (!existingLocation) throw new AppError.NotFoundError('Location not found');
        country_id = existingLocation.country_id
      }
      await this.checkCityCountry(city_id, country_id, tx);
    }

    return await locationRepo.withTx(tx).update({
      where: { location_id: locationID },
      data: {
        ...location,
        country: country_id ? { connect: { country_id: country_id } } : undefined,
        city: city_id ? { connect: { city_id: city_id } } : undefined,
      },
      include: { city: true, country: true },
    }).catch((err) => {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2003') throw new AppError.NotFoundError("couldn't find specified country (or city) ID");
        if (err.code === 'P2002') throw new AppError.ConflictError('A location with this place ID already exists');
      }
      throw err;
    })
  }

  async deleteLocation(locationID: string, tx?: Prisma.TransactionClient) {
    await locationRepo.withTx(tx).deleteById(locationID).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError("couldn't find specified location ID");
        if (e.code === 'P2003') throw new AppError.ConflictError('Cannot delete location because it is still in use')
      }
      throw e;
    })
  }

  // ─── Country ──────────────────────────────────────────────────────────────────

  async getCountries(query: location.GetCountriesQuery) {
    const skip = (query.page - 1) * query.limit;
    const where = query.filters.search
      ? { name: { contains: query.filters.search, mode: 'insensitive' as const } }
      : {};

    const [countries, total] = await Promise.all([
      countryRepo.findMany({ where, skip, take: query.limit, orderBy: { name: 'asc' } }),
      countryRepo.count({ where }),
    ]);

    return {
      countries,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async getCountry(countryID: number) {
    const res = await countryRepo.findUnique({ where: { country_id: countryID } });
    if (!res) throw new AppError.NotFoundError('Country not found');
    return res;
  }

  async createCountry(input: location.CreateCountryBody, tx?: Prisma.TransactionClient) {
    return await countryRepo.withTx(tx).create({ data: deepClean(input) }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002') throw new AppError.ConflictError('Country already exists');
      throw e;
    });
  }

  async updateCountry(countryID: number, input: location.UpdateCountryBody, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getCountry(countryID);

    return await countryRepo.withTx(tx).update({
      where: { country_id: countryID },
      data,
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Country not found');
        if (e.code === 'P2002') throw new AppError.ConflictError('Country already exists');
      }
      throw e;
    });
  }

  async deleteCountry(countryID: number, tx?: Prisma.TransactionClient) {
    await countryRepo.withTx(tx).deleteById(countryID).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('Country not found');
        if (e.code === 'P2003') throw new AppError.ConflictError('Cannot delete country because it is still in use');
      }
      throw e;
    });
  }

  // ─── City ─────────────────────────────────────────────────────────────────────

  async getCities(query: location.GetCitiesQuery) {
    const skip = (query.page - 1) * query.limit;
    const where = {
      ...(query.filters.search ? { name: { contains: query.filters.search, mode: 'insensitive' as const } } : {}),
      ...(query.filters.country_id ? { country_id: query.filters.country_id } : {}),
    };

    const [cities, total] = await Promise.all([
      cityRepo.findMany({ where, skip, take: query.limit, orderBy: { name: 'asc' } }),
      cityRepo.count({ where }),
    ]);

    return {
      cities,
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
    };
  }

  async getCity(cityID: number) {
    const res = await cityRepo.findUnique({ where: { city_id: cityID } });
    if (!res) throw new AppError.NotFoundError('City not found');
    return res;
  }

  async createCity(input: location.CreateCityBody, tx?: Prisma.TransactionClient) {
    return await cityRepo.withTx(tx).create({ data: deepClean(input) }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('City already exists in this country');
        if (e.code === 'P2003') throw new AppError.NotFoundError('Country not found');
      }
      throw e;
    });
  }

  async updateCity(cityID: number, input: location.UpdateCityBody, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getCity(cityID);

    return await cityRepo.withTx(tx).update({
      where: { city_id: cityID },
      data,
    }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('City not found');
        if (e.code === 'P2002') throw new AppError.ConflictError('City already exists in this country');
        if (e.code === 'P2003') throw new AppError.NotFoundError('Country not found');
      }
      throw e;
    });
  }

  async deleteCity(cityID: number, tx?: Prisma.TransactionClient) {
    await cityRepo.withTx(tx).deleteById(cityID).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError.NotFoundError('City not found');
        if (e.code === 'P2003') throw new AppError.ConflictError('Cannot delete city because it is still in use');
      }
      throw e;
    });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────────

  private async checkCityCountry(cityID: number, countryID: number, tx?: Prisma.TransactionClient) {
    const city = await cityRepo.withTx(tx).findById(cityID);
    if (!city) throw new AppError.NotFoundError("couldn't find specified city ID");
    if (city.country_id !== countryID) throw new AppError.ValidationError("this city doesn't belong in this country");
  }
}

export const locationService = new LocationService();
