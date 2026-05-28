import { ApolloServer } from '@apollo/server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
import depthLimit from 'graphql-depth-limit';
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';

import { mapErrorToResponse } from '../utils/errorMapper.util.js';
import { createDataLoaders, DataLoaders } from './dataloaders/index.js';
import { resolvers } from './resolvers/index.js';
import { accessPayload } from '../validations/jwt.schema.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load all .graphql files from the schemas folder
const loadedSchemas = loadSchemaSync(path.join(__dirname, 'schemas/**/*.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

// Merge them into a single type definitions string
const typeDefs = mergeTypeDefs(loadedSchemas);

export const graphqlServer = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers: {
    ...resolvers,
    BigInt: BigIntResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
  },
  validationRules: [depthLimit(7)],
  formatError: (formattedError: GraphQLFormattedError, error: unknown) => {
    const originalError = (error as any)?.originalError ?? error;
    const mapped = mapErrorToResponse(originalError);

    return new GraphQLError(mapped.message, {
      extensions: {
        success: mapped.success,
        code: mapped.code,
        statusCode: mapped.statusCode,
        ...(mapped.details && { details: mapped.details }),
      },
    });
  },
});

export interface GraphqlContext {
  user: accessPayload | undefined | null;
  loaders: DataLoaders;
  req: Request;
  res: Response;
}

export const createContext = async ({ req, res }: { req: Request; res: Response }) => {
  const user = req.user;
  const loaders = createDataLoaders(user?.user_id);
  
  res.on('finish', () => {
    Object.values(loaders.post).forEach(loader => loader.clearAll());
    Object.values(loaders.story).forEach(loader => loader.clearAll());
    Object.values(loaders.comment).forEach(loader => loader.clearAll());
  });

  return { user, loaders, req, res };
};