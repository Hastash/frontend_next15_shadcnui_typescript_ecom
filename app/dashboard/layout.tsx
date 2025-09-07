import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { IconLoader2 } from "@tabler/icons-react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
export default function Page({children}: {children: React.ReactNode}) {
  const { status } = useSession();
  if (status === "loading")
    return (
      <IconLoader2 className="size-10 animate-spin mx-auto h-screen text-gray-500" />
    );

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
