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
import { GoogleButton } from "@/components/ui/google-button";

export default function LoginPage() {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <>
      <Toaster />
      <Navbar />
      <main
        className="p-4 lg:p-8 max-w-md mx-auto sm:min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-1 max-lg:landscape:py-24"
        aria-label="Entrar na conta KWK"
        role="main"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-xl border border-zinc-300 dark:border-zinc-800 p-4 lg:p-8"
            aria-labelledby="form-heading"
          >
            <span className="text-3xl mb-4 font-bold self-start">
              Acessar conta
              <span className="block text-base font-light">
                Bem vindo de volta!
              </span>
            </span>
            <Separator className="my-4 bg-zinc-300 dark:bg-zinc-800" />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl className="w-76 lg:w-80">
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Senha</FormLabel>
                  <FormControl className="w-76 lg:w-80">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              title="Entrar"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2
                  className={`h-4 w-4 animate-spin ${
                    isLoading ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <Separator className="mb-4 bg-zinc-300 dark:bg-zinc-800" />
            <GoogleButton />
            <div className="text-sm text-center text-zinc-500 dark:text-zinc-400 mt-4">
              Esqueceu a senha?{" "}
              <Link
                href="/forgot-password"
                passHref
                className="text-primary underline"
              >
                Recuperar
              </Link>
              <br />
              Não tem uma conta?{" "}
              <Link
                href="/register"
                passHref
                className="text-primary underline"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </Form>
      </main>
    </>
  );
}
