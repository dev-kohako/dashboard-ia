import type { Tag } from '@prisma/client';
import {
  addTagToTask,
  createTag,
  deleteTag,
  listTags,
  updateTag,
} from '../controllers/tag.controller';
import type { Context } from '../types/auth.types';
import type {
  addTagToTaskInput,
  CreateTagInput,
  DeleteTagInput,
  TagResponse,
  UpdateTagInput,
} from '../types/tag.types';

export const tagResolvers = {
  Mutation: {
    createTag: async (
      _: any,
      args: { input: CreateTagInput },
      context: Context,
    ): Promise<TagResponse> => {
      return await createTag(args.input, context);
    },
    updateTag: async (
      _: any,
      args: { input: UpdateTagInput },
      context: Context,
    ): Promise<TagResponse> => {
      return await updateTag(args.input, context);
    },
    deleteTag: async (
      _: any,
      args: { input: DeleteTagInput },
      context: Context,
    ): Promise<TagResponse> => {
      return await deleteTag(args.input, context);
    },
    addTagToTask: async (
      _: any,
      args: { input: addTagToTaskInput },
      context: Context,
    ): Promise<TagResponse> => {
      return await addTagToTask(args.input, context);
    },
  },
  Query: {
    listTags: async (_: any, __: any, context: Context): Promise<Tag[]> => {
      return await listTags(_, __, context);
    },
  },
};
