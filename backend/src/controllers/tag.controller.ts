import { Prisma, type Tag } from '@prisma/client';
import type {
  addTagToTaskInput,
  CreateTagInput,
  TagResponse,
  UpdateTagInput,
} from '../types/tag.types';
import type { Context } from '../types/auth.types';
import { assertAuthenticated, handleError } from '../utils/utils';
import prisma from '../utils/prisma';

export const createTag = async (
  { name, color }: CreateTagInput,
  context: Context,
): Promise<TagResponse> => {
  try {
    assertAuthenticated(context);

    const trimmedName = name?.trim();
    if (!trimmedName) {
      throw new Error('O nome da tag é obrigatório.');
    }

    const tag = await prisma.tag.create({
      data: {
        name: trimmedName,
        color: color?.trim() || null,
        userId: context.userId,
      },
    });

    return {
      tag,
      message: 'Tag criada com sucesso!',
    };
  } catch (error) {
    handleError(error);
  }
};

export const updateTag = async (
  { tagId, name, color }: UpdateTagInput,
  context: Context,
): Promise<TagResponse> => {
  try {
    assertAuthenticated(context);

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag || tag.userId !== context.userId) {
      throw new Error('Tag não encontrada ou sem permissão.');
    }

    const updateData: Prisma.TagUpdateInput = {};
    if (name?.trim()) updateData.name = name.trim();
    if (color?.trim()) updateData.color = color.trim();

    if (Object.keys(updateData).length === 0) {
      throw new Error('Nenhum dado válido fornecido para atualização.');
    }

    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: updateData,
    });

    return {
      tag: updatedTag,
      message: 'Tag atualizada com sucesso!',
    };
  } catch (error) {
    handleError(error);
  }
};

export const deleteTag = async (
  { tagId }: { tagId: string },
  context: Context,
): Promise<TagResponse> => {
  try {
    assertAuthenticated(context);

    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag || tag.userId !== context.userId) {
      throw new Error('Tag não encontrada ou sem permissão.');
    }

    await prisma.tag.delete({
      where: { id: tagId },
    });

    return {
      message: 'Tag deletada com sucesso!',
    };
  } catch (error) {
    handleError(error);
  }
};

export const listTags = async (
  _: unknown,
  __: unknown,
  context: Context,
): Promise<Tag[]> => {
  try {
    assertAuthenticated(context);

    return await prisma.tag.findMany({
      where: { userId: context.userId },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    handleError(error);
  }
};

export const addTagToTask = async (
  { taskId, tagId }: addTagToTaskInput,
  context: Context,
): Promise<{ message: string }> => {
  try {
    assertAuthenticated(context);

    const [task, tag] = await Promise.all([
      prisma.task.findUnique({
        where: { id: taskId },
        include: { tags: true },
      }),
      prisma.tag.findUnique({
        where: { id: tagId },
      }),
    ]);

    if (!task || task.userId !== context.userId) {
      throw new Error('Tarefa não encontrada ou sem permissão.');
    }

    if (!tag || tag.userId !== context.userId) {
      throw new Error('Tag inválida.');
    }

    if (!tag || tag.userId || !task || task.userId !== context.userId) {
      throw new Error('Tag ou tarefa não encontrada ou sem permissão.');
    }

    const alreadyLinked = task.tags.some((t) => t.id === tagId);
    if (alreadyLinked) {
      return { message: 'Tag já está vinculada à tarefa.' };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        tags: {
          connect: { id: tagId },
        },
      },
    });

    return { message: 'Tag adicionada à tarefa com sucesso!' };
  } catch (error) {
    handleError(error);
  }
};
