import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, "O e-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .max(100, "O e-mail deve ter no máximo 100 caracteres")
    .transform(val => val.trim().toLowerCase()),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
