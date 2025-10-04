import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { IconLoader2 } from "@tabler/icons-react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
export default async function Page({children}: {children: React.ReactNode}) {
  const {session: { user },}: any = await verifySession();
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
