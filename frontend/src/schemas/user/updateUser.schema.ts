import { z } from "zod";

const COMMON_PASSWORDS = [
  "123456",
  "password",
  "12345678",
  "123123",
  "111111",
  "qwerty",
  "abc123",
  "senha",
  "password1",
  "1234567",
];

const FORBIDDEN_NAME_CHARACTERS = /[<>{}[\]~^\\]/;
const FORBIDDEN_NAME_WORDS = ["admin", "root", "moderator", "system", "user"];
const nameRegex = /^[a-zA-ZÀ-ÿ]+(?:[a-zA-ZÀ-ÿ\s'-]+)*[a-zA-ZÀ-ÿ]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

async function sha1(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function isPwned(password: string): Promise<boolean> {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const data = await res.text();

  return data.split("\n").some((line) => line.startsWith(suffix));
}

export const updateUserSchema = z
  .object({
    firstName: z
      .string()
      .max(50, "O nome deve ter no máximo 50 caracteres")
      .regex(nameRegex, "O nome deve conter apenas letras")
      .refine((val) => !FORBIDDEN_NAME_CHARACTERS.test(val), {
        message: "O nome contém caracteres inválidos",
      })
      .refine(
        (val) =>
          !FORBIDDEN_NAME_WORDS.some((word) =>
            val.toLowerCase().includes(word)
          ),
        {
          message: "O nome contém termos não permitidos",
        }
      )
      .transform((val) => val.trim().replace(/\s+/g, " "))
      .optional(),

      lastName: z
      .string()
      .max(50, "O sobrenome deve ter no máximo 50 caracteres")
      .refine(
        (val) => val === "" || nameRegex.test(val),
        "O sobrenome deve conter apenas letras"
      )
      .refine((val) => !FORBIDDEN_NAME_CHARACTERS.test(val), {
        message: "O sobrenome contém caracteres inválidos",
      })
      .transform((val) => val.trim().replace(/\s+/g, " "))
      .optional(),

    email: z
      .string()
      .email("Formato de e-mail inválido")
      .max(100, "O e-mail deve ter no máximo 100 caracteres")
      .transform((val) => val.trim().toLowerCase())
      .optional(),

    oldPassword: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .optional(),

    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .max(50, "A senha deve ter no máximo 50 caracteres")
      .regex(
        passwordRegex,
        "A senha deve conter pelo menos: uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&) "
      )
      .refine((val) => !COMMON_PASSWORDS.includes(val.toLowerCase()), {
        message: "Essa senha é muito comum e insegura",
      })
      .refine(
        async (val) => {
          const pwned = await isPwned(val);
          return !pwned;
        },
        {
          message:
            "Essa senha já apareceu em vazamentos de dados. Escolha outra.",
        }
      )
      .optional(),
      
      twoFactorEnabled: z
      .boolean({
        required_error: "Selecione se deseja ativar ou desativar o 2FA",
        invalid_type_error: "Valor inválido para autenticação de dois fatores",
      })
      .optional(),
  })
  .refine(
    (data) => {
      return Object.keys(data).length > 0;
    },
    {
      message: "Nenhum dado para atualizar",
    }
  ).refine(
    (data) => {
      if (data.password && !data.oldPassword) {
        return false;
      }
      return true;
    },
    {
      path: ["oldPassword"],
      message: "Informe a senha atual para definir uma nova senha",
    }
  );

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
