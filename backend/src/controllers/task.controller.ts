import { Prisma } from "@prisma/client";
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
} from "../types/task.types";
import type { Context } from "../types/auth.types";
import prisma from "../utils/prisma";
import { assertAuthenticated, handleError } from "../utils/utils";

export const getTask = async (
  { taskId }: GetTaskInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    if (!taskId) throw new Error("ID da tarefa é obrigatório.");
    assertAuthenticated(context);

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: context.userId },
    });

    if (!task) throw new Error("Tarefa não encontrada");

    return { task, message: "Tarefa recuperada com sucesso!" };
  } catch (error) {
    handleError(error);
  }
};

export const getTaskStats = async (
  _: unknown,
  context: Context
): Promise<TaskStats> => {
  assertAuthenticated(context);

  const where = { userId: context.userId };
  const [total, todo, inProgress, done, expired, canceled] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.count({ where: { ...where, state: "TODO" } }),
    prisma.task.count({ where: { ...where, state: "IN_PROGRESS" } }),
    prisma.task.count({ where: { ...where, state: "DONE" } }),
    prisma.task.count({ where: { ...where, state: "EXPIRED" } }),
    prisma.task.count({ where: { ...where, state: "CANCELED" } }),
  ]);

  return { total, todo, inProgress, done, expired, canceled };
};

export const getTaskSortBy = async (
  {
    title,
    state,
    priority,
    dueDateFrom,
    dueDateTo,
    order = "desc",
    limit = 10,
    page = 1,
  }: GetTaskSortByInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    assertAuthenticated(context);

    const where: Prisma.TaskWhereInput = {
      userId: context.userId,
      ...(state && { state }),
      ...(priority && { priority }),
      ...(title && { title: { contains: title } }),
      ...(dueDateFrom && { dueDate: { gte: new Date(dueDateFrom) } }),
      ...(dueDateTo && {
        dueDate: {
          ...(dueDateFrom ? {} : { gte: new Date(0) }),
          lte: new Date(dueDateTo),
        },
      }),
    };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: order },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      tasks,
      message: tasks.length
        ? "Tarefas recuperadas com sucesso!"
        : "Nenhuma tarefa encontrada.",
    };
  } catch (error) {
    handleError(error);
  }
};

export const getTaskHistory = async (
  taskId: string,
  context: Context
): Promise<TaskHistory[]> => {
  try {
    assertAuthenticated(context);

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: context.userId },
    });

    if (!task) throw new Error("Tarefa não encontrada");

    const history = await prisma.taskHistory.findMany({
      where: { taskId },
      orderBy: { changedAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return history;
  } catch (error) {
    throw error;
  }
};

export const createTask = async (
  { title, description, state, priority, dueDate }: CreateTaskInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    if (!title || !description || !state || !priority || !dueDate) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    assertAuthenticated(context);

    const task = await prisma.task.create({
      data: {
        userId: context.userId,
        title,
        description,
        state,
        priority,
        dueDate,
      },
    });

    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedBy: context.userId,
        changeType: "CREATED",
        newState: task.state,
      },
    });

    return { task, message: "Tarefa criada com sucesso!" };
  } catch (error) {
    handleError(error);
  }
};

export const duplicateTask = async (
  { taskId }: DuplicateTaskInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    if (!taskId) throw new Error("ID da tarefa é obrigatório.");
    assertAuthenticated(context);

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId: context.userId },
    });

    if (!task) throw new Error("Tarefa não encontrada");

    const duplicated = await prisma.task.create({
      data: {
        userId: context.userId,
        title: `${task.title} (Cópia)`,
        description: task.description,
        priority: task.priority,
        state: "TODO",
        dueDate: task.dueDate,
      },
    });

        await prisma.taskHistory.create({
      data: {
        taskId: duplicated.id,
        changedBy: context.userId,
        changeType: "DUPLICATED",
        newState: duplicated.state,
      },
    });

    return { task: duplicated, message: "Tarefa duplicada com sucesso!" };
  } catch (error) {
    handleError(error);
  }
};

export const updateTask = async (
  { taskId, title, description, state, priority, dueDate }: UpdateTaskInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    if (!taskId) throw new Error("ID da tarefa é obrigatório.");
    assertAuthenticated(context);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId, userId: context.userId },
    });

    if (!existingTask) throw new Error("Tarefa não encontrada");

    const updateData: Prisma.TaskUpdateInput = {
      ...(title && { title }),
      ...(description && { description }),
      ...(state && { state }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate }),
    };

    if (Object.keys(updateData).length === 0) {
      throw new Error("Nenhum dado válido fornecido para atualização.");
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId, userId: context.userId },
      data: updateData,
    });

    await prisma.taskHistory.create({
      data: {
        taskId: existingTask.id,
        changedBy: context.userId,
        changeType: "STATE_UPDATE",
        previousState: existingTask.state,
        newState: state,
      },
    });

    return { task: updatedTask, message: "Tarefa atualizada com sucesso!" };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTask = async (
  { taskId }: DeleteTaskInput,
  context: Context
): Promise<TaskResponse> => {
  try {
    if (!taskId) throw new Error("ID da tarefa é obrigatório.");
    assertAuthenticated(context);

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId, userId: context.userId },
    });

    if (!existingTask) throw new Error("Tarefa não encontrada");

    await prisma.task.delete({
      where: { id: taskId, userId: context.userId },
    });

        await prisma.taskHistory.create({
      data: {
        taskId,
        changedBy: context.userId,
        changeType: "DELETED",
        previousState: existingTask.state,
      },
    });

    return { message: "Tarefa deletada com sucesso!" };
  } catch (error) {
    handleError(error);
  }
};