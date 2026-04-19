"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/redux/features/auth/authSlice";
import Navbar from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function BasicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();

  // Hide storefront Navbar/Footer for auth pages, customer dashboard, and ALL management (admin) pages
  const hideNavAndFooter =
    pathName === "/login" ||
    pathName === "/register" ||
    pathName.startsWith("/dashboard") ||
    pathName.startsWith("/management");

  return (
    <AuthInitializer>
      {!hideNavAndFooter && (
        <header className="relative z-[1000] w-full">
          <Navbar />
        </header>
      )}
      <main className="md:px-5 px-3">{children}</main>
      {!hideNavAndFooter && (
        <nav>
          <Footer />
        </nav>
      )}
      <Toaster position="top-right" />
    </AuthInitializer>
  );
}