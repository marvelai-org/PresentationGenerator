"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { HeroUIProvider } from "@/providers/HeroUIProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>{children}</HeroUIProvider>
    </ThemeProvider>
  );
}
