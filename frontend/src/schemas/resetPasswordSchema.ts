import { z } from "zod";

const COMMON_PASSWORDS = [
    '123456', 'password', '12345678', '123123', '111111',
    'qwerty', 'abc123', 'senha', 'password1', '1234567'
  ];

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

async function sha1(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  
  async function isPwned(password: string): Promise<boolean> {
    const hash = await sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
  
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await res.text();
  
    return data.split('\n').some(line => line.startsWith(suffix));
  }

export const resetPasswordSchema = z
  .object({
    newPassword: z.string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .max(50, "A senha deve ter no máximo 50 caracteres")
        .regex(passwordRegex, "A senha deve conter pelo menos: uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&)")
        .refine(val => !COMMON_PASSWORDS.includes(val.toLowerCase()), {
          message: "Essa senha é muito comum e insegura"
        })
        .refine(async val => {
          const pwned = await isPwned(val);
          return !pwned;
        }, {
          message: "Essa senha já apareceu em vazamentos de dados. Escolha outra.",
        }),
    confirmNewPassword: z.string()
    .min(1, "Confirme sua senha"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
