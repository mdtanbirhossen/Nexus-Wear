"use client";

import { ReactNode, useEffect } from "react";
import { AppSidebarAdmin } from "@/components/app-sidebar-admin";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "@/redux/store";
import { Separator } from "@/components/ui/separator";
import {
     Breadcrumb,
     BreadcrumbItem,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ManagementLayout({ children }: { children: ReactNode }) {
     const pathname = usePathname();
     const formattedPathname = pathname.split('/').pop()?.replace(/^./, c => c.toUpperCase()) || "Dashboard";
     const router = useRouter();
     
     // IMPORTANT: Read from adminAuth instead of auth
     const { token } = useAppSelector((state) => state.adminAuth);
     const rehydrated = useAppSelector((state: RootState) => (state.adminAuth as unknown as { _persist: { rehydrated: boolean } })._persist?.rehydrated);

     const isSigninPage = pathname?.replace(/\/$/, "") === "/management/signin";

     useEffect(() => {
          // Redirect to management signin if not authenticated
          if (rehydrated && !token && !isSigninPage) {
               router.replace("/management/signin");
          }
     }, [rehydrated, token, pathname, router, isSigninPage]);

     if (!token && !isSigninPage) {
          return null;
     }

     return (
          <SidebarProvider>
               <div className="flex w-full min-h-screen overflow-hidden">
                    {!isSigninPage && <AppSidebarAdmin />}

                    {!isSigninPage ? (
                         <main className="flex-1 w-full overflow-hidden">
                              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                                   <SidebarTrigger className="-ml-1" />
                                   <Separator
                                        orientation="vertical"
                                        className="mr-2 data-[orientation=vertical]:h-4"
                                   />
                                   <Breadcrumb>
                                        <BreadcrumbList>
                                             <BreadcrumbSeparator className="hidden md:block" />
                                             <BreadcrumbItem>
                                                  <BreadcrumbPage>{formattedPathname}</BreadcrumbPage>
                                             </BreadcrumbItem>
                                        </BreadcrumbList>
                                   </Breadcrumb>
                              </header>

                              {/* scrollable area */}
                              <div className="p-4 w-full overflow-x-auto">
                                   {children}
                              </div>
                         </main>
                    ) : (
                         <div className="flex-1">{children}</div>
                    )}
               </div>
          </SidebarProvider>
     );
}
