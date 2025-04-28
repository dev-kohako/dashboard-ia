import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().min(6, "O código deve ter 6 dígitos"),
});

export type VerifySchema = z.infer<typeof verifySchema>;