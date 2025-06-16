import type { Context } from '../types/auth.types';

export function assertAuthenticated(
  context: Context,
): asserts context is Context & { userId: string } {
  if (!context.userId) {
    throw new Error('Usuário não autenticado.');
  }
}

export function handleError(error: unknown): never {
  const message = error instanceof Error ? error.message : 'Erro inesperado';
  throw new Error(message);
}
