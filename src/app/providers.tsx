"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
