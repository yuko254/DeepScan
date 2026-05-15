import { ApolloServer } from '@apollo/server';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers/index.js';
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';
import type { Context } from '../types/context.js';

const typeDefs = readFileSync('src/graphql/schema.graphql', 'utf-8');

export const graphqlServer = new ApolloServer<Context>({
  typeDefs,
  resolvers: {
    BigInt: BigIntResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
    ...resolvers,
  },
});