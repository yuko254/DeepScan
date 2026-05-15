import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers/index.js';
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';
import type { GraphqlContext } from '../dtos/dto.js';

const typeDefs = readFileSync('src/graphql/schema.graphql', 'utf-8');

export const graphqlServer = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers: {
    BigInt: BigIntResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    ...resolvers,
  },
});