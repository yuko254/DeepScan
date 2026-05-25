import { ApolloServer } from '@apollo/server';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
// import { resolvers } from './resolvers/index.js';
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';
import { mapErrorToResponse } from '../utils/errorMapper.util.js';
import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import type { GraphqlContext } from '../dtos/dto.js';
import path from 'path';
import { fileURLToPath } from 'url';

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
    BigInt: BigIntResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    // ...resolvers,
  },
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