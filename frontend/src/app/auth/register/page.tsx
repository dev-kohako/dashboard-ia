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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useRegister } from "./useRegister";
import { PasswordInput } from "@/components/ui/password-input";
import { GoogleLoginButton } from "@/components/google-login-button";

export default function RegisterPage() {
  const { form, onSubmit, isLoading } = useRegister();

  return (
    <>
      <Toaster />
      <Navbar />
      <main
        className="p-4 lg:p-8 max-w-md mx-auto sm:min-h-screen flex flex-col justify-center items-center py-24 sm:py-0 max-lg:landscape:py-24"
        role="main"
        aria-label="Criar conta KWK"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-xl border border-zinc-300 dark:border-zinc-800 p-4 lg:p-8"
            aria-labelledby="form-heading"
          >
            <span
              className="text-3xl mb-4 font-bold self-start"
              id="form-heading"
            >
              Criar conta
              <span className="block text-base font-light">
                Bem vindo ao KWK
              </span>
            </span>
            <Separator className="my-4 bg-zinc-300 dark:bg-zinc-800" />
            <div className="flex flex-col sm:flex-row sm:space-x-4 gap-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-44">
                    <FormLabel htmlFor="firstName">Nome</FormLabel>
                    <FormControl>
                      <Input
                        id="firstName"
                        placeholder="Digite seu nome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full lg:w-44">
                    <FormLabel htmlFor="lastName">Sobrenome</FormLabel>
                    <FormControl>
                      <Input
                        id="lastName"
                        placeholder="Digite seu sobrenome"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
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
                  <FormControl >
                    <PasswordInput
                      id="password"
                      placeholder="Crie uma senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    Confirmar senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirme sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="terms"
                        className="cursor-pointer"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Aceitar termos e condições
                      </FormLabel>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Ao se cadastrar, você concorda com nossos Termos de Serviço
                    e Política de Privacidade.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2"
              disabled={isLoading}
              title="Criar conta"
            >
              {isLoading && (
                <Loader2
                  className={`h-4 w-4 animate-spin ${
                    isLoading ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
              {isLoading ? "Criando..." : "Criar conta"}
            </Button>
            <Separator className="mb-4 bg-zinc-300 dark:bg-zinc-800" />
            <GoogleLoginButton />
            
          </form>
        </Form>
      </main>
    </>
  );
}
