"use client";

import { notify } from "@/lib/utils";
import { VERIFY_MUTATION } from "@/queries/verify";
import { VerifySchema, verifySchema } from "@/schemas/verifySchema";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useVerifyCode() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const [verifyMutation] = useMutation(VERIFY_MUTATION);
  const searchParams = useSearchParams();

  const form = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const userId = searchParams.get("userId");

  const onSubmit = async (data: VerifySchema) => {
    try {
      setIsLoading(true);

      if (!userId) {
        throw new Error("Sessão inválida. Por favor, faça login novamente.");
      }

      if (!data.code || data.code.length < 6) {
        throw new Error(
          "Por favor, insira um código de verificação válido (6 dígitos)."
        );
      }

      const { data: result, errors } = await verifyMutation({
        variables: {
          userId,
          code: data.code.trim(),
        },
      });

      const { token, user } = result.verify;

      if (errors) {
        const errorMessages = errors
          .map((err) => {
            if (err.message.includes("expired")) {
              return "Código expirado. Solicite um novo código.";
            }
            if (err.message.includes("invalid")) {
              return "Código inválido. Verifique e tente novamente.";
            }
            if (err.message.includes("attempts")) {
              return "Muitas tentativas incorretas. Tente novamente mais tarde.";
            }
            return err.message;
          })
          .join("\n");

        throw new Error(errorMessages);
      }

      if (!result?.verify) {
        throw new Error("Resposta inesperada do servidor. Tente novamente.");
      }

      if (!token) {
        throw new Error("Falha na verificação. Token não recebido.");
      }

      if (!userId) {
        throw new Error("Não foi possível identificar o usuário registrado.");
      }

      login(token, user);

      notify.success(
        "Verificação concluída com sucesso!",
        `Redirecionando para o dashboard...`
      );

      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: unknown) {
      console.error("Erro na verificação do código:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado durante a verificação.";

      notify.error("Falha na verificação", errorMessage);

      if (
        err instanceof Error &&
        (err.message.includes("expirou") || err.message.includes("inválido"))
      ) {
        notify.info("Dica", "Deseja receber um novo código?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
