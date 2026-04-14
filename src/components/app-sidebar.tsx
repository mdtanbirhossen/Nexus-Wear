"use client"

import * as React from "react"
import {
     GalleryVerticalEnd,
     ShoppingCart, User, Settings, Home, Heart, CreditCard,
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

// Customer Dashboard Data
const data = {
     user: {
          name: "Customer",
          email: "customer@example.com",
          avatar: "/avatars/user.jpg",
     },
     teams: [
          {
               name: "Nexus Wear",
               logo: GalleryVerticalEnd,
               plan: "Member",
          },
     ],
     main: [
          { name: "My Dashboard", url: "/dashboard", icon: Home },
     ],
     account: [
          { name: "My Profile", url: "/dashboard/profile", icon: User },
          { name: "My Orders", url: "/dashboard/orders", icon: ShoppingCart },
          { name: "Wishlist", url: "/dashboard/wishlist", icon: Heart },
          { name: "Payment Methods", url: "/dashboard/payments", icon: CreditCard },
     ],
     settings: [
          { name: "Settings", url: "/dashboard/settings", icon: Settings },
     ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <TeamSwitcher teams={data.teams} />
               </SidebarHeader>

               <SidebarContent>
                    <NavProjects title="Account" items={data.main} />
                    <NavProjects title="Shopping" items={data.account} />
                    <NavProjects title="Preferences" items={data.settings} />
               </SidebarContent>

               <SidebarFooter>
                    <NavUser user={data.user} />
               </SidebarFooter>
          </Sidebar>
     )
}
