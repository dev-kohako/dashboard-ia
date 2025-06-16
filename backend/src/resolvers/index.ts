import { authResolvers } from './auth.resolver.ts';
import { tagResolvers } from './tag.resolver.ts';
import { taskResolvers } from './task.resolver.ts';
import { userResolvers } from './user.resolver.ts';

export const resolvers = [
  authResolvers,
  userResolvers,
  taskResolvers,
  tagResolvers,
];
