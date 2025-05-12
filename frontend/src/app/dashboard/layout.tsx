"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <SiteHeader />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
