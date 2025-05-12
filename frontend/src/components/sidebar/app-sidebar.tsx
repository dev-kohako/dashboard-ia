"use client";

import * as React from "react";
import Image from "next/image";
import { BarChart2, Bot, CalendarDays, CheckCircle, Home, Repeat, Settings, StickyNote, Wallet } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { user } = useUserStore();

  const navItems = [
    { title: "Início", url: "/dashboard", icon: Home },
    { title: "Minhas Tarefas", url: "/dashboard/tasks", icon: CheckCircle },
    { title: "Hábitos", url: "/habitos", icon: Repeat },
    { title: "Agenda", url: "/agenda", icon: CalendarDays },
    { title: "Notas Rápidas", url: "/notas", icon: StickyNote },
    { title: "Finanças", url: "/financas", icon: Wallet },
    { title: "Assistente IA", url: "/assistente", icon: Bot },
    { title: "Relatórios", url: "/relatorios", icon: BarChart2 },
    { title: "Configurações", url: "/configuracoes", icon: Settings },
  ];

  React.useEffect(() => {
    if (!user?.id) {
      router.push("/auth/login");
    }
  }, [user?.id, router]);

  if (!user) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Image
            src="/images/logo.png"
            width={32}
            height={32}
            className="max-h-8 dark:invert"
            alt="logo"
          />
        </SidebarHeader>
        <SidebarContent>
          <div className="px-2 pb-1 space-y-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-6" />
            ))}
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 pb-1">
            <Skeleton className="w-full h-10" />
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  const initials = user.name
    ?.split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase())
    .join("")
    .slice(0, 2) || user.email[0]?.toUpperCase() || "";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          src="/images/logo.png"
          width={32}
          height={32}
          className="max-h-8 dark:invert"
          alt="logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl,
          initials
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}