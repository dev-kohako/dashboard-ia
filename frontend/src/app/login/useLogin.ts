"use client";

import { notify } from "@/lib/utils";
import { LOGIN_MUTATION } from "@/queries/login";
import { LoginSchema, loginSchema } from "@/schemas/loginSchema";
import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const { login } = useAuthStore();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      setIsLoading(true);

      if (!data.email || !data.password) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      const { data: result, errors } = await loginMutation({
        variables: {
          email: data.email.trim(),
          password: data.password,
        },
      });

      if (errors) {
        const errorMessages = errors
          .map((err) => {
            if (err.message.includes("credentials")) {
              return "Credenciais inválidas. Verifique seu e-mail e senha.";
            }
            return err.message;
          })
          .join("\n");

        throw new Error(errorMessages);
      }

      if (!result?.login) {
        throw new Error("Resposta inesperada do servidor. Tente novamente.");
      }

      const token = result.login.token;
      const user = result.login.user;

      if (!token) {
        throw new Error("Autenticação falhou. Token não recebido.");
      }

      if (!user) {
        throw new Error(
          "Autenticação incompleta. Dados do usuário não recebidos."
        );
      }

      login(token, user);

      notify.success(
        `Bem-vindo(a) de volta, ${user.name || ""}!`,
        "Redirecionando para o dashboard..."
      );

      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: unknown) {
      console.error("Erro no processo de login:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro inesperado durante o login.";

      notify.error("Falha no login", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
