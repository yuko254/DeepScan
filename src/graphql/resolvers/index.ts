import type { Resolvers } from '../graphql.js';
import { userResolvers } from './users';
import { postResolvers } from './posts';
// ... etc

export const resolvers: Resolvers<Context> = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
  },
  users: userResolvers.users,
  posts: postResolvers.posts,
  // ...
};