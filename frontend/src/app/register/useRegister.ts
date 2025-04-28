"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { REGISTER_MUTATION } from "@/queries/register";
import { registerSchema, RegisterSchema } from "@/schemas/registerSchema";
import { notify } from "@/lib/utils";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("As senhas não coincidem.");
      }

      if (!data.acceptTerms) {
        throw new Error("Você deve aceitar os termos para se registrar.");
      }

      const { data: result, errors } = await registerMutation({
        variables: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          acceptTerms: String(data.acceptTerms),
        },
      });

      if (errors) {
        const errorMessages = errors.map((err) => err.message).join(", ");
        throw new Error(`Erro no servidor: ${errorMessages}`);
      }

      if (!result?.register) {
        throw new Error("Resposta inesperada do servidor.");
      }

      const token = result.register.token;
      const userId = result.register.user?.id;

      if (!token || !userId) {
        throw new Error("Não foi possível completar o registro.");
      }

      notify.success(
        `Tudo certo!`,
        "Redirecionando para o verificação..."
      );

      setTimeout(() => router.push(`/verify-code?userId=${userId}`), 3000);
    } catch (err) {
      console.error("Erro no registro:", err);
      notify.error(
        err instanceof Error ? err.message : "Erro desconhecido",
        "Erro no Registro"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
