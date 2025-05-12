"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useState, useRef } from "react";

import { notify } from "@/lib/utils/utils";
import { RESET_PASSWORD_MUTATION } from "@/queries/auth/resetUserPassword";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schemas/resetPasswordSchema";

export function useResetPassword() {
  const router = useRouter();
  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION);
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    const resetPasswordToken = searchParams.get("token");

    if (!resetPasswordToken) {
      notify.error("Token inválido", "Solicite uma nova redefinição de senha.");
      return;
    }

    console.log(resetPasswordToken)

    setIsLoading(true);

    try {
      const { data: errors } = await resetPasswordMutation({
        variables: {
          input: {
            token: resetPasswordToken,
            newPassword: data.newPassword,
          }
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      notify.success(
        "Senha redefinida com sucesso!",
        "Redirecionando para login..."
      );
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err);

      const message = err?.message || "Erro inesperado. Tente novamente.";
      if (message.toLowerCase().includes("token")) {
        notify.error(
          "Link inválido ou expirado",
          "Solicite uma nova redefinição."
        );
      } else {
        notify.error("Erro ao redefinir senha", "Tente novamente mais tarde.");
      }
      newPasswordRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    isLoading,
    newPasswordRef,
  };
}
