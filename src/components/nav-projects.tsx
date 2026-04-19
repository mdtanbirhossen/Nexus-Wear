"use client"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavProjectsProps } from "@/types/navProjectsProps"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NavProjects({ title, items }: NavProjectsProps) {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className="md:hidden">
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <Link
                href={item.url}
                onClick={() => toggleSidebar()}
                className="block"
              >
                <SidebarMenuButton 
                  tooltip={item.name} 
                  isActive={isActive}
                  className={cn(
                    "relative transition-all duration-200 h-10 px-3",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-secondary" />
                  )}
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        "h-4 w-4 transition-colors", 
                        isActive ? "text-secondary" : "text-sidebar-foreground/60"
                      )} 
                    />
                  )}
                  <span 
                    className={cn(
                      "font-medium transition-colors", 
                      isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/70"
                    )}
                  >
                    {item.name}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
      <SidebarMenu className="md:flex hidden">
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <Link
                href={item.url}
                className="block"
              >
                <SidebarMenuButton 
                  tooltip={item.name} 
                  isActive={isActive}
                  className={cn(
                    "relative transition-all duration-200 h-10 px-3",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-secondary" />
                  )}
                  {item.icon && (
                    <item.icon 
                      className={cn(
                        "h-4 w-4 transition-colors", 
                        isActive ? "text-secondary" : "text-sidebar-foreground/60"
                      )} 
                    />
                  )}
                  <span 
                    className={cn(
                      "font-medium transition-colors", 
                      isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/70"
                    )}
                  >
                    {item.name}
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
