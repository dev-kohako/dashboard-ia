import {
  createTask,
  deleteTask,
  duplicateTask,
  getTask,
  getTaskHistory,
  getTaskSortBy,
  getTaskStats,
  updateTask,
} from '../controllers/task.controller';
import type { Context } from '../types/auth.types';
import type {
  CreateTaskInput,
  DeleteTaskInput,
  DuplicateTaskInput,
  GetTaskInput,
  GetTaskSortByInput,
  TaskHistory,
  TaskResponse,
  TaskStats,
  UpdateTaskInput,
} from '../types/task.types';

export const taskResolvers = {
  Mutation: {
    createTask: async (
      _: any,
      args: { input: CreateTaskInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await createTask(args.input, context);
    },
    duplicateTask: async (
      _: any,
      args: { input: DuplicateTaskInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await duplicateTask(args.input, context);
    },
    updateTask: async (
      _: any,
      args: { input: UpdateTaskInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await updateTask(args.input, context);
    },
    deleteTask: async (
      _: any,
      args: { input: DeleteTaskInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await deleteTask(args.input, context);
    },
  },
  Query: {
    getTask: async (
      _: any,
      args: { input: GetTaskInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await getTask(args.input, context);
    },
    getTaskStats: async (
      _: any,
      __: any,
      context: Context,
    ): Promise<TaskStats> => {
      return await getTaskStats(_, context);
    },
    getTaskSortBy: async (
      _: any,
      args: { input: GetTaskSortByInput },
      context: Context,
    ): Promise<TaskResponse> => {
      return await getTaskSortBy(args.input, context);
    },
    getTaskHistory: async (
      _: any,
      args: { taskId: string },
      context: Context,
    ): Promise<TaskHistory[]> => {
      return await getTaskHistory(args.taskId, context);
    },
  },
};
