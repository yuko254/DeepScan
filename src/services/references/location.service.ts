import { Prisma } from "../../config/prisma.js";
import { locationRepo, cityRepo, countryRepo } from "../../Repository/instances.js";
import { deepClean } from "../../dtos/dto.js";
import * as location from "../../validations/location.schema.js";
import * as AppError from '../../types/appErrors.types.js';

class LocationService {

  // ─── Location ──────────────────────────────────────────────────────────────────

  async getLocation(locationID: string, tx?: Prisma.TransactionClient) {
    const location = await locationRepo.withTx(tx).findWithDetails(locationID);
    if (!location) throw new AppError.NotFoundError('Location not found');
    return location;
  }

  async createLocation(input: location.LocationCreate, tx?: Prisma.TransactionClient) {
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

  async updateLocation(input: location.LocationUpdate, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0)
      return this.getLocation(input.location_id, tx);

    let { city_id, country_id, ...location } = data

    if (city_id) {
      if (!country_id) {
        const existingLocation = await locationRepo.withTx(tx).findUnique({
          where: { location_id: input.location_id },
          select: { country_id: true }
        });
        if (!existingLocation) throw new AppError.NotFoundError('Location not found');
        country_id = existingLocation.country_id
      }
      await this.checkCityCountry(city_id, country_id, tx);
    }

    return await locationRepo.withTx(tx).update({
      where: { location_id: input.location_id },
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

  async resolveLocation(input: location.LocationUpsert | null | undefined, existingLocationId: string | null | undefined, tx?: Prisma.TransactionClient) {
    if (input === undefined) return undefined;

    if (input === null) {
      if (existingLocationId) await this.deleteLocation(existingLocationId, tx);
      return null;
    }

    if (!("location_id" in input)) {
      return await this.createLocation(input, tx).then(l => l.location_id);
    }

    return await this.updateLocation(input, tx).then(l => l.location_id);
  }

  // ─── Country ──────────────────────────────────────────────────────────────────

  async getCountries(query: string) {
    return countryRepo.search(query);
  }

  async getCountry(countryID: number) {
    const res = await countryRepo.findUnique({ where: { country_id: countryID } });
    if (!res) throw new AppError.NotFoundError('Country not found');
    return res;
  }

  async createCountry(input: location.CountryCreate, tx?: Prisma.TransactionClient) {
    return await countryRepo.withTx(tx).create({ data: deepClean(input) }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002') throw new AppError.ConflictError('Country already exists');
      throw e;
    });
  }

  async updateCountry(input: location.CountryUpdate, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getCountry(input.country_id);

    return await countryRepo.withTx(tx).update({
      where: { country_id: input.country_id },
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

  async getCities(query: string) {
    return cityRepo.search(query);
  }

  async getCity(cityID: number) {
    const res = await cityRepo.findUnique({ where: { city_id: cityID } });
    if (!res) throw new AppError.NotFoundError('City not found');
    return res;
  }

  async createCity(input: location.CityCreate, tx?: Prisma.TransactionClient) {
    return await cityRepo.withTx(tx).create({ data: deepClean(input) }).catch((e) => {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') throw new AppError.ConflictError('City already exists in this country');
        if (e.code === 'P2003') throw new AppError.NotFoundError('Country not found');
      }
      throw e;
    });
  }

  async updateCity(input: location.CityUpdate, tx?: Prisma.TransactionClient) {
    const data = deepClean(input);
    if (Object.keys(data).length === 0) return this.getCity(input.city_id);

    return await cityRepo.withTx(tx).update({
      where: { city_id: input.city_id },
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
