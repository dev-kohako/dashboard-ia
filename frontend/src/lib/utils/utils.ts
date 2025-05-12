import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(
  value: number,
  currency: string = "BRL",
  locale: string = "pt-BR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTime(startAt: string, endAt: string): string {
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  const start = new Date(startAt);
  const end = new Date(endAt);

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${start.toLocaleTimeString('pt-BR', timeOpts)} - ${end.toLocaleTimeString('pt-BR', timeOpts)}`;
  } else {
    return `${start.toLocaleString('pt-BR')} - ${end.toLocaleString('pt-BR')}`;
  }
}

export function formatEventDateTime(startAt: string, endAt: string): string {
  const dateOpts: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const start = new Date(startAt);
  const end = new Date(endAt);

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${start.toLocaleDateString('pt-BR', dateOpts)}`;
  } else {
    return `${start.toLocaleString('pt-BR')} - ${end.toLocaleString('pt-BR')}`;
  }
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

