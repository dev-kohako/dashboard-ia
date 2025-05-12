"use client";

import { notify } from "@/lib/utils/utils";
import { VERIFY_MUTATION } from "@/queries/auth/verifyUserEmail";
import { VerifySchema, verifySchema } from "@/schemas/verifySchema";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";

export function useVerifyCode() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const { login } = useAuthStore();
  const [verifyMutation] = useMutation(VERIFY_MUTATION);

  const form = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifySchema) => {
    try {
      setIsLoading(true);

      if (!user?.id) {
        throw new Error("Sessão inválida. Faça login novamente.");
      }

      const { data: result, errors } = await verifyMutation({
        variables: {
          input: {
            userId: user.id,
            code: data.code.trim(),
          },
        },
      });

      if (errors?.length) {
        const errorMessages = errors
          .map((err) => {
            if (err.message.includes("expired")) {
              return "Código expirado. Solicite um novo código.";
            }
            if (err.message.includes("invalid")) {
              return "Código inválido. Verifique e tente novamente.";
            }
            return err.message;
          })
          .join("\n");

        throw new Error(errorMessages);
      }

      const response = result?.verifyUserEmail;

      setUser(response.user);
      login(response.token);

      notify.success("Login verificado com sucesso!", "Redirecionando...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      console.error("Erro na verificação do código:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado durante a verificação.";

      notify.error("Falha na verificação", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
