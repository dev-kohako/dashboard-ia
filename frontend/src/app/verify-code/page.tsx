"use client";

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
import { Toaster } from "sonner";
import { useVerifyCode } from "./useVerifyCode";

export default function VerifyCode() {
  const { form, onSubmit, isLoading } = useVerifyCode();

  return (
    <main
      className="p-4 lg:p-8 max-w-md mx-auto sm:min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-1 max-lg:landscape:py-24"
      role="main"
      aria-label="Código de verificação KWK"
    >
      <Navbar />
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 border border-zinc-300 dark:border-zinc-800 p-6 rounded-xl"
          role="main"
        >
          <h2 className="text-3xl font-bold">Verificar Código</h2>
          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="code">Código de verificação</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            title="Verificar"
          >
            {isLoading && (
              <Loader2
                className={`h-4 w-4 animate-spin ${
                  isLoading ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            {isLoading ? "Verificando..." : "Verificar"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
