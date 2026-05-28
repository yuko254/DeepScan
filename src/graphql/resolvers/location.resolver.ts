import { Resolvers } from '../generated/graphql.js';
import { GraphqlContext } from '../server.js';
import { locationService } from '../../services/references/location.service.js';
import * as idSchema from '../../validations/id.schema.js';
import * as locationSchema from '../../validations/location.schema.js';
import { querySchema } from '../../validations/search.schema.js';
import * as AppError from '../../types/appErrors.types.js';
import { requireAdmin } from './helper.js';

export const locationResolver: Resolvers = {
  Query: {
    location: async (_, args) => {
      const { location_id } = idSchema.LocationIdParamSchema.parse({ location_id: args.id });
      const location = await locationService.getLocation(location_id);
      return location as any;
    },

    countries: async (_, args) => {
      const { search } = querySchema.parse({ search: args.search });
      if (!search) return [];
      const countries = await locationService.getCountries(search);
      return countries as any;
    },

    cities: async (_, args) => {
      const { search } = querySchema.parse({ search: args.search });
      if (!search) return [];
      const cities = await locationService.getCities(search);
      return cities as any;
    },
  },

  Mutation: {
    createLocation: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = locationSchema.LocationCreateSchema.parse(args.data);
      const location = await locationService.createLocation(input);
      return location as any;
    },

    updateLocation: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const input = locationSchema.LocationUpdateSchema.parse(args.data);
      const location = await locationService.updateLocation(input);
      return location as any;
    },

    deleteLocation: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      const { location_id } = idSchema.LocationIdParamSchema.parse({ location_id: args.id });
      await locationService.deleteLocation(location_id);
      return true;
    },

    createCountry: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = locationSchema.CountryCreateSchema.parse(args.data);
      const country = await locationService.createCountry(input);
      return country as any;
    },

    updateCountry: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = locationSchema.CountryUpdateSchema.parse(args.data)
      const country = await locationService.updateCountry(input);
      return country as any;
    },

    deleteCountry: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const { country_id } = idSchema.CountryIdParamSchema.parse({ country_id: args.id });
      await locationService.deleteCountry(country_id);
      return true;
    },

    createCity: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = locationSchema.CityCreateSchema.parse(args.data);
      const city = await locationService.createCity(input);
      return city as any;
    },

    updateCity: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const input = locationSchema.CityUpdateSchema.parse(args.data);
      const city = await locationService.updateCity(input);
      return city as any;
    },

    deleteCity: async (_, args, context: GraphqlContext) => {
      if (!context.user?.user_id) throw new AppError.UnauthorizedError('Authentication required');
      requireAdmin(context.user);
      const { city_id } = idSchema.CityIdParamSchema.parse({ city_id: args.id });
      await locationService.deleteCity(city_id);
      return true;
    },
  }
};