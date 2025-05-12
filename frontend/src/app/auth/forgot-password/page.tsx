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
import { Loader2 } from "lucide-react";
import { useForgotPassword } from "./useForgotPassword";

export default function ForgotPasswordPage() {
  const { form, onSubmit, isLoading, counter, inputRef, isCooldown } =
    useForgotPassword();

  return (
    <>
      <Toaster />
      <Navbar />
      <main
        className="p-4 lg:p-8 max-w-md mx-auto sm:min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-1 max-lg:landscape:py-24"
        role="main"
        aria-label="Esqueceu a senha"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-xl border border-zinc-300 dark:border-zinc-800 p-4 lg:p-8"
            aria-labelledby="forgot-password-title"
          >
            <h1
              id="forgot-password-title"
              className="text-3xl mb-4 font-bold self-start"
            >
              Recuperar senha
            </h1>
            <Separator className="my-4 bg-zinc-300 dark:bg-zinc-800" />
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
                      placeholder="seuemail@exemplo.com"
                      className="w-76 lg:w-80"
                      {...field}
                      ref={(e) => {
                        field.ref(e);
                        inputRef.current = e;
                      }}
                      aria-invalid={
                        form.formState.errors.email ? "true" : "false"
                      }
                      aria-describedby="email-error"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage id="email-error" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2"
              disabled={isLoading || isCooldown}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Enviando...
                </>
              ) : isCooldown ? (
                `Enviar link (${counter}s)`
              ) : (
                "Enviar link"
              )}
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
