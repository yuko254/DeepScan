import type { Resolvers } from '../graphql.js';
import { userResolvers } from './users.js';
import { postResolvers } from './posts.js';
import { feedResolvers } from './feed.js';
import { commentResolvers } from './comments.js';
import { reportResolvers } from './reports.js';
import { notificationResolvers } from './notifications.js';

export const resolvers: Resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...feedResolvers.Query,
    ...commentResolvers.Query,
    ...reportResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...feedResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...reportResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  users: userResolvers.users,
  posts: postResolvers.posts,
  comments: commentResolvers.comments,
  reports: reportResolvers.reports,
  notifications: notificationResolvers.notifications,
};