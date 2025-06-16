import { authSchema } from './auth.schema';
import { taskSchema } from './task.schema.ts';
import { userSchema } from './user.schema.ts';
import { tagSchema } from './tag.schema.ts';

export const typeDefs = [authSchema, userSchema, taskSchema, tagSchema];
