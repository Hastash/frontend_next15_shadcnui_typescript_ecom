"use client"

import * as React from "react"
import {
  IconCalendarMonth,
  IconCalendarPin,
  IconCalendarWeek,
  IconCamera,
  IconFileAi,
  IconFileDescription,
  IconHexagons,
  IconLayoutDashboard,
  IconList,
  IconPackages,
  IconSettings,
  IconShoppingCartCheck,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: IconList,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: IconPackages,
    },
    {
      title: "Sales",
      url: "/dashboard/sales",
      icon: IconShoppingCartCheck
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Doanh thu ngày",
      url: "/dashboard/reports/dailysales",
      icon: IconCalendarPin,
    },
    {
      name: "Doanh thu tuần",
      url: "/dashboard/reports/weeklysales",
      icon: IconCalendarWeek,
    },
    {
      name: "Doannh thu tháng",
      url: "/dashboard/reports/monthlysales",
      icon: IconCalendarMonth,
    },
  ],
}
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: any; // hoặc định nghĩa type rõ ràng
};
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconHexagons className="!size-5" />
                <span className="text-base font-semibold">Hóa Chất Cơ Bản MN</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
