"use client"

import * as React from "react"
import {
     GalleryVerticalEnd,
     ShoppingCart, Package, Users, Folder, Layers, Palette, Ruler, Bell, Settings, UserCog, Shield,
     Home,
     PlusCircle
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarHeader,
} from "@/components/ui/sidebar"

// Admin Dashboard Data
const data = {
     user: {
          name: "Admin",
          email: "admin@nexuswear.com",
          avatar: "/avatars/admin.jpg",
     },
     teams: [
          {
               name: "Nexus-Wear",
               logo: GalleryVerticalEnd,
               plan: "Pro Management",
          },
     ],
     main: [
          { name: "Dashboard", url: "/management", icon: Home },
     ],
     ecommerce: [
          { name: "Products", url: "/management/products", icon: Package },
          { name: "Add Product", url: "/management/products/create", icon: PlusCircle },
          { name: "Orders", url: "/management/orders", icon: ShoppingCart },
          { name: "Customers", url: "/management/customers", icon: Users },
          { name: "Notifications", url: "/management/notifications", icon: Bell },
     ],
     catalog: [
          { name: "Categories", url: "/management/categories", icon: Folder },
          { name: "Subcategories", url: "/management/subcategories", icon: Layers },
          { name: "Colors", url: "/management/color", icon: Palette },
          { name: "Sizes", url: "/management/size", icon: Ruler },
     ],
     userManagement: [
          { name: "Admins", url: "/management/admin", icon: UserCog },
          { name: "Roles & Permissions", url: "/management/role", icon: Shield },
     ],
     settings: [
          { name: "Settings", url: "/management/settings", icon: Settings },
     ],
}

export function AppSidebarAdmin({ ...props }: React.ComponentProps<typeof Sidebar>) {
     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher teams={data.teams} />
               </SidebarHeader>

               <SidebarContent>
                    <NavProjects title="Main" items={data.main} />
                    <NavProjects title="Ecommerce" items={data.ecommerce} />
                    <NavProjects title="Catalog" items={data.catalog} />
                    <NavProjects title="User Management" items={data.userManagement} />
                    <NavProjects title="Settings" items={data.settings} />
               </SidebarContent>

               <SidebarFooter>
                    <NavUser user={data.user} />
               </SidebarFooter>
          </Sidebar>
     )
}
