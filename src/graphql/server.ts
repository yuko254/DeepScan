import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import depthLimit from 'graphql-depth-limit';
import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { GraphQLError, type GraphQLFormattedError } from 'graphql';
import { BigIntResolver, DateTimeResolver, JSONResolver } from 'graphql-scalars';

import { mapErrorToResponse } from '../utils/errorMapper.util.js';
import { extractAndVerifyToken } from '../utils/token.util.js';
import { createDataLoaders, DataLoaders } from './dataloaders/index.js';
import { resolvers } from './resolvers/index.js';
import { accessPayload } from '../validations/jwt.schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadedSchemas = loadSchemaSync(path.join(__dirname, 'schemas/**/*.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const typeDefs = mergeTypeDefs(loadedSchemas);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    BigInt: BigIntResolver,
    DateTime: DateTimeResolver,
    JSON: JSONResolver,
  },
});

export const pubsub = new PubSub();

export interface GraphqlContext {
  user: accessPayload | undefined | null;
  loaders: DataLoaders;
  req: Request;
  res: Response;
  pubsub: PubSub;
}

export const createContext = async ({ req, res }: { req: Request; res: Response }) => {
  const user = (req as any).user;
  const loaders = createDataLoaders(user?.user_id);

  res.on('finish', () => {
    Object.values(loaders.post).forEach(loader => loader.clearAll());
    Object.values(loaders.story).forEach(loader => loader.clearAll());
    Object.values(loaders.comment).forEach(loader => loader.clearAll());
  });

  return { user, loaders, req, res, pubsub };
};

export async function createGraphQLServer(httpServer: any) {
  const wsServer = new WebSocketServer({
    port: 4001,
    path: '/graphql',
    perMessageDeflate: false,
  });

  wsServer.on('listening', () => console.log('✅ WebSocket server is listening'));
  wsServer.on('error', (error) => console.error('❌ WebSocket server error:', error));

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const user = extractAndVerifyToken(ctx);
        const loaders = createDataLoaders(user?.user_id);
        return { user, loaders, pubsub };
      },
      onConnect: async (ctx) => {
        console.log(`🔗 WS client connected`);
        return true;
      },
      onDisconnect: (ctx, code, reason) => {
        console.log(`🔌 WS disconnected — code: ${code}, reason: ${reason}`);
      },
      onNext: (ctx, id, payload, args, result) => {
        if (result.errors) {
          result.errors = result.errors.map((error: GraphQLError) => {
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
          });
        }
        return result;
      },
      onError: (ctx, msg, errors) => {
        console.error('❌ WS error:', errors);
        throw errors
      },
    },
    wsServer
  );

  const graphqlServer = new ApolloServer<GraphqlContext>({
    schema,
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
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      { async serverWillStart() { return { async drainServer() { await serverCleanup.dispose(); } } } }
    ],
  });

  await graphqlServer.start();
  console.log('✅ GraphQL server started');
  return graphqlServer;
}