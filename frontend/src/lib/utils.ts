import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const notify = {
  success: (msg: string, desc?: string) =>
    toast.success(msg, {
      description: desc,
      className: "bg-green-600 text-white",
      richColors: true,
    }),

  error: (msg: string, desc?: string) =>
    toast.error(msg, {
      description: desc,
      className: "bg-red-600 text-white",
      richColors: true,
    }),

  warning: (msg: string, desc?: string) =>
    toast.warning(msg, {
      description: desc,
      className: "bg-yellow-500 text-black",
      richColors: true,
    }),

  info: (msg: string, desc?: string) =>
    toast.info(msg, {
      description: desc,
      className: "bg-blue-500 text-white",
      richColors: true,
    }),
};