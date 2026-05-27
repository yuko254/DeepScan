// AUTO-GENERATED - DO NOT EDIT
// Run 'npm run generate:resolvers' to update

import { contentResolver } from './content.resolver.js';
import { feedResolver } from './feed.resolver.js';
import { interactionsResolver } from './interactions.resolver.js';
import { userResolver } from './user.resolver.js';

export const resolvers = {
  ...contentResolver,
  ...feedResolver,
  ...interactionsResolver,
  ...userResolver,
  Query: {
  ...contentResolver.Query,
  ...feedResolver.Query,
  ...interactionsResolver.Query,
  ...userResolver.Query,
  },
  Mutation: {
  ...contentResolver.Mutation,
  ...feedResolver.Mutation,
  ...interactionsResolver.Mutation,
  ...userResolver.Mutation,
  }
};
