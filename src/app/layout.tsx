import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";
import BasicLayout from "./BasicLayout";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus Wear",
  description: "Premium fashion for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} ${roboto.className} antialiased`}>
        <ReduxProvider>
          <BasicLayout>{children}</BasicLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
