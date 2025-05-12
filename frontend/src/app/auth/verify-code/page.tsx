"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Navbar } from "@/components/ui/navbar";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useVerifyCode } from "./useVerifyCode";

export default function VerifyCode() {
  const { form, onSubmit, isLoading } = useVerifyCode();

  return (
    <>
      <Toaster richColors position="top-center" className="font-sans" />
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center justify-center overflow-hidden p-4 sm:min-h-screen pt-24 sm:pt-1 max-lg:landscape:py-24 lg:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-96 space-y-4 rounded-xl border border-zinc-300 p-6 dark:border-zinc-800"
          >
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              Verificação de Segurança
            </h1>
            <p className="text-muted-foreground">
              Insira o código enviado para seu email
            </p>

            <Separator className="my-4" aria-hidden="true" />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Código de Verificação
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2 justify-between items-center">
                      <InputOTP
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="justify-center items-center"
                      >
                        <InputOTPGroup  className="justify-be items-center">
                          <InputOTPSlot className="w-12 h-12" index={0} />
                          <InputOTPSlot className="w-12 h-12" index={1} />
                          <InputOTPSlot className="w-12 h-12" index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot className="w-12 h-12" index={3} />
                          <InputOTPSlot className="w-12 h-12" index={4} />
                          <InputOTPSlot className="w-12 h-12" index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <p className="text-xs text-center text-muted-foreground">
                        Digite todos os 6 caracteres do código recebido
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm font-medium" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Confirmar Código</span>
              )}
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
