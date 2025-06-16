import { TaskState, TaskPriority, type Tag } from '@prisma/client';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  state: TaskState;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags?: Tag[];
}

export interface TaskWithDetails extends Task {
  comments: TaskComment[];
  history: TaskHistory[];
  tags: Tag[];
}

export interface TaskComment {
  id: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  taskId: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface TaskHistory {
  id: string;
  taskId: string;
  changedBy: string;
  changeType: string;
  previousState: TaskState | null;
  newState: TaskState | null;
  changedAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface CreateTaskInput {
  title: string;
  description: string;
  state: TaskState;
  priority: TaskPriority;
  dueDate: string | Date;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  state?: TaskState | null;
  priority?: TaskPriority;
  dueDate?: string | Date;
  tagIds?: string[];
}

export interface GetTaskInput {
  taskId: string;
}

export interface DeleteTaskInput {
  taskId: string;
}

export interface DuplicateTaskInput {
  taskId: string;
}

export interface GetTaskSortByInput {
  title?: string;
  state?: TaskState;
  priority?: TaskPriority;
  dueDateFrom?: string | Date;
  dueDateTo?: string | Date;
  tagIds?: string[];
  orderBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  order?: 'asc' | 'desc';
  limit?: number;
  page?: number;
}

export interface SearchTasksInput {
  query: string;
  limit?: number;
}

export interface BaseResponse {
  success?: boolean;
  message?: string;
  code?: string;
}

export interface TaskResponse extends BaseResponse {
  task?: Task;
  tasks?: Task[];
  totalCount?: number;
}

export interface PaginatedTaskResponse extends TaskResponse {
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskStatsResponse extends BaseResponse {
  stats: TaskStats;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  expired: number;
  canceled: number;
}
