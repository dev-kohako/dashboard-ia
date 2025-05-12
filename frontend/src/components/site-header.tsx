"use client";

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ui/toggleDarkMode";

export function SiteHeader() {
  const router = useRouter()
  const [pageTitle, setPageTitle] = useState("")
  const path = usePathname()

  useEffect(() => {
    
    const titleMap: Record<string, string> = {
      "/": "Início",
      "/dashboard": "Dashboard",
      "/dashboard/account": "Conta",
      "/documents": "Documentos",
    }

    const fallbackTitle = path.split("/").pop()?.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()) || "Página"
    setPageTitle(titleMap[path] || fallbackTitle)
  }, [router, path])

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
      </div>
      <div className="mr-2">
      <ModeToggle />
      </div>
    </header>
  )
}
