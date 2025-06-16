import { TaskPriority, TaskState } from '@prisma/client';

const STATE_FLOW: Record<TaskState, TaskState[]> = {
  TODO: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['DONE', 'CANCELED'],
  DONE: [],
  CANCELED: [],
  EXPIRED: ['TODO', 'IN_PROGRESS'],
};

export function isValidDate(date: any): boolean {
  return !isNaN(Date.parse(date));
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function validateTaskInput(input: any): void {
  if (
    !input.title ||
    !input.description ||
    !input.state ||
    !input.priority ||
    !input.dueDate
  ) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  if (input.title.length > 200) {
    throw new Error('O título não pode exceder 200 caracteres.');
  }

  if (!Object.values(TaskState).includes(input.state)) {
    throw new Error('Estado inválido.');
  }

  if (!Object.values(TaskPriority).includes(input.priority)) {
    throw new Error('Prioridade inválida.');
  }

  if (!isValidDate(input.dueDate)) {
    throw new Error('Data inválida.');
  }
}

export function validateStateTransition(
  currentState: TaskState,
  newState: TaskState,
): void {
  if (!STATE_FLOW[currentState].includes(newState)) {
    throw new Error(
      `Transição de estado inválida: ${currentState} -> ${newState}`,
    );
  }
}
