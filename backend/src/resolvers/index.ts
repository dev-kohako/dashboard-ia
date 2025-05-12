import { authResolvers } from './auth.resolver.ts';
import { userResolvers } from './user.resolver.ts';

export const resolvers = [
  authResolvers,
  userResolvers
];