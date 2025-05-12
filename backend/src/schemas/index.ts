import { authSchema } from './auth.schema';
import { userSchema } from './user.schema.ts';

export const typeDefs = [
  authSchema,
  userSchema
];