import type { Tag } from '@prisma/client';

export interface TagResponse {
  tag?: Tag;
  tags?: Tag[];
  message?: string;
  error?: string;
}

export interface AddTaskTagInput {
  taskId: string;
}

export interface CreateTagInput {
  name: string;
  color: string;
}

export interface UpdateTagInput {
  tagId: string;
  name: string;
  color: string;
}

export interface DeleteTagInput {
  tagId: string;
}

export interface addTagToTaskInput {
  taskId: string;
  tagId: string;
}
