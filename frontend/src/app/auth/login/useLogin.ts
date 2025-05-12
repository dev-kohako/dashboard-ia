"use client";

import { notify } from "@/lib/utils/utils";
import { LOGIN_MUTATION } from "@/queries/auth/loginUser";
import { LoginSchema, loginSchema } from "@/schemas/loginSchema";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
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
  const { setUser } = useUserStore();

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
          input: {
            email: data.email.trim(),
            password: data.password,
          },
        },
      });
  
      if (errors?.length) {
        const errorMessages = errors
          .map((err) =>
            err.message.includes("credentials") || err.message.includes("senha")
              ? "Credenciais inválidas. Verifique seu e-mail e senha."
              : err.message
          )
          .join("\n");
  
        throw new Error(errorMessages);
      }
  
      const response = result?.loginUser;
      if (!response?.user) {
        throw new Error("Autenticação falhou. Usuário não encontrado.");
      }
  
      const { user, token } = response;
  
      setUser(user);
  
      if (user.twoFactorEnabled) {
        notify.success(
          `Código de verificação enviado para ${user.email}`,
          "Redirecionando para verificação..."
        );
        setTimeout(() => router.push("/auth/verify-code"), 2000);
      } else {
        if (!token) {
          throw new Error("Token não recebido. Tente novamente.");
        }
  
        login(token);
        notify.success(
          `Bem-vindo(a) de volta, ${user.name || ""}!`,
          "Redirecionando para o dashboard..."
        );
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      notify.error(
        "Erro ao fazer login",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading };
}
