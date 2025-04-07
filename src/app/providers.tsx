"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </ThemeProvider>
  );
} 