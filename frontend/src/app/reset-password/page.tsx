"use client";

import { Suspense, useEffect, useState } from "react";
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
import { useResetPassword } from "./useResetPassword";

export default function ResetPasswordPage() {
  const { form, onSubmit, isLoading, newPasswordRef } = useResetPassword();

  return (
    <>
      <Toaster />
      <Navbar />
      <main
        className="p-4 lg:p-8 max-w-md mx-auto sm:min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-1 max-lg:landscape:py-24"
        role="main"
        aria-label="Redefinir senha KWK"
      >
        <Suspense>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 rounded-xl border border-zinc-300 dark:border-zinc-800 p-4 lg:p-8"
              aria-labelledby="reset-password-title"
            >
              <h1
                id="reset-password-title"
                className="text-3xl mb-4 font-bold self-start"
              >
                Redefinir senha
              </h1>
              <Separator className="my-4 bg-zinc-300 dark:bg-zinc-800" />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                    <FormControl className="w-76 lg:w-80">
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Digite sua nova senha"
                        {...field}
                        ref={(e) => {
                          field.ref(e);
                          newPasswordRef.current = e;
                        }}
                        aria-invalid={
                          form.formState.errors.newPassword ? "true" : "false"
                        }
                        aria-describedby="newPassword-error"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage id="newPassword-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmNewPassword">
                      Confirmar nova senha
                    </FormLabel>
                    <FormControl className="w-76 lg:w-80">
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        placeholder="Confirme sua nova senha"
                        {...field}
                        aria-invalid={
                          form.formState.errors.confirmNewPassword
                            ? "true"
                            : "false"
                        }
                        aria-describedby="confirmNewPassword-error"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage id="confirmNewPassword-error" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading && (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                {isLoading ? "Redefinindo..." : "Redefinir senha"}
              </Button>
            </form>
          </Form>
        </Suspense>
      </main>
    </>
  );
}
