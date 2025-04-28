"use client";

import { notify } from "@/lib/utils";
import { FORGOT_PASSWORD_MUTATION } from "@/queries/forgotPassword";
import { ForgotPasswordSchema, forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [counter, setCounter] = useState(60);
  const [forgotPasswordMutation] = useMutation(FORGOT_PASSWORD_MUTATION);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCooldown) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCooldown(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isCooldown]);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const { data: result, errors } = await forgotPasswordMutation({
        variables: {
          email: data.email,
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      const token = result?.forgotPassword?.token;
      if (!token) {
        throw new Error("Token não recebido.");
      }

      notify.success("Link enviado!", "Verifique seu email.");
    } catch (err: any) {
      console.error("Erro ao enviar email:", err);

      const message = err?.message || "Erro inesperado. Tente novamente.";
      if (message.includes("usuário") || message.includes("não encontrado")) {
        notify.error("Email não encontrado", "Verifique o endereço de email.");
        inputRef.current?.focus();
      } else {
        notify.error("Erro ao enviar email", "Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, onSubmit, isLoading, counter, inputRef, isCooldown };
}
