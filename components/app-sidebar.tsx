"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { menuConfig } from "./menu-config"

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
import { useAuth } from "@/context/AuthContext"
import { UserRole } from "@/types/user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const pathname = usePathname();
  // Démo : on considère qu'un email se terminant par 'admin' est admin
  const isAdmin = user?.role === UserRole.ADMIN;

  // Adapt user for NavUser
  const navUser = user
    ? {
        id: user.id,
        role: user.role,
        name: user.email.split("@")[0],
        email: user.email,
        avatar: user.avatar || '/avatars/default.png', // fallback to default if not found
      }
    : {
        id: "",
        role: UserRole.USER,
        name: "Invité",
        email: "",
        avatar: "/avatars/default.png",
      };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">InvestEasy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuConfig.map((section) => {
          if (section.adminOnly && !isAdmin) return null;
          return (
            <div key={section.section} className="mb-4">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.section}
              </div>
              <ul>
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        href={item.path}
                        className={`flex items-center gap-2 py-2 px-4 rounded transition-colors w-full ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'}`}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
