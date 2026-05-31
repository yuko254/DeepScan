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
import { verifyAccessToken } from '../utils/jwt.utils.js';
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

const pubsub = new PubSub();

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

function extractWsUser(ctx: any): accessPayload | null {
  try {
    // 1. connectionParams (Altair, mobile clients)
    const raw = ctx.connectionParams?.authorization as string | undefined;
    if (raw?.startsWith('Bearer ')) return verifyAccessToken(raw.slice(7));

    // 2. Cookie from upgrade request (browser)
    const cookieHeader = ctx.extra?.request?.headers?.cookie;
    if (cookieHeader) {
      const match = cookieHeader.match(/(?:^|;\s*)access_token=([^;]+)/);
      if (match) return verifyAccessToken(match[1]!);
    }

    // 3. HTTP upgrade headers
    const headerAuth = ctx.extra?.request?.headers?.authorization;
    if (headerAuth?.startsWith('Bearer ')) return verifyAccessToken(headerAuth.slice(7));

    return null;
  } catch {
    return null;
  }
}

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
        const user = extractWsUser(ctx);
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