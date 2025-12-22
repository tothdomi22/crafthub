import type {Metadata} from "next";
import {Inter, Outfit} from "next/font/google";
import "./globals.css";
import React from "react";
import QueryProvider from "@/app/providers/QueryProvider";
import {ToastContainer} from "react-toastify";
import {ThemeProvider} from "next-themes";

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | madebyme",
    default: "madebyme - Egyedi kézműves piactér",
  },
  description:
    "Fedezd fel a legkülönlegesebb kézműves termékeket, közvetlenül az alkotóktól.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" suppressHydrationWarning className="light ">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>{children}</QueryProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
