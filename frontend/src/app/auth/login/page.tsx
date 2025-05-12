"use client";

import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useLogin } from "./useLogin";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleLoginButton } from "@/components/google-login-button";

export default function LoginPage() {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <>
      <Toaster richColors position="top-right" className="font-sans" />
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center justify-center overflow-hidden p-4 py-16 sm:min-h-screen pt-24 sm:pt-1 max-lg:landscape:py-24 lg:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-96 space-y-4 rounded-xl border border-zinc-300 p-6 dark:border-zinc-800"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight text-foreground">
                Acesse sua conta
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta!
              </p>
            </div>

            <Separator className="my-4" aria-hidden="true" />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-foreground">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Digite sua senha"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar na conta</span>
              )}
            </Button>

            <Separator className="my-4" aria-hidden="true" />

            <GoogleLoginButton />

            <div className="space-y-2 text-center text-sm text-muted-foreground">
              <p>
                Esqueceu a senha?{" "}
                <Link
                  href="/auth/forgot-password"
                  passHref
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Recuperar
                </Link>
              </p>
              <p>
                Não possui uma conta?{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
