// AUTO-GENERATED - DO NOT EDIT
// Run 'npm run generate:resolvers' to update

import { chatResolver } from './chat.resolver.js';
import { contentResolver } from './content.resolver.js';
import { feedResolver } from './feed.resolver.js';
import { interactionsResolver } from './interactions.resolver.js';
import { locationResolver } from './location.resolver.js';
import { notificationsResolver } from './notifications.resolver.js';
import { referencesResolver } from './references.resolver.js';
import { userResolver } from './user.resolver.js';

export const resolvers = {
  ...chatResolver,
  ...contentResolver,
  ...feedResolver,
  ...interactionsResolver,
  ...locationResolver,
  ...notificationsResolver,
  ...referencesResolver,
  ...userResolver,
  Query: {
  ...chatResolver.Query,
  ...contentResolver.Query,
  ...feedResolver.Query,
  ...interactionsResolver.Query,
  ...locationResolver.Query,
  ...notificationsResolver.Query,
  ...referencesResolver.Query,
  ...userResolver.Query,
  },
  Mutation: {
  ...chatResolver.Mutation,
  ...contentResolver.Mutation,
  ...feedResolver.Mutation,
  ...interactionsResolver.Mutation,
  ...locationResolver.Mutation,
  ...notificationsResolver.Mutation,
  ...referencesResolver.Mutation,
  ...userResolver.Mutation,
  }
};
