import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .max(100, "O e-mail deve ter no máximo 100 caracteres")
    .transform(val => val.trim().toLowerCase()),

  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(50, "A senha deve ter no máximo 50 caracteres")
});

export type LoginSchema = z.infer<typeof loginSchema>;
