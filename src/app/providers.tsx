"use client";

import { ReactNode } from "react";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { AuthProvider } from "@/providers/AuthProvider";

/**
 * Wraps children with theming, UI, and authentication providers.
 *
 * This component nests three providers: ThemeProvider, which applies a default dark theme using a "class" attribute; HeroUIProvider, which supplies UI context; and AuthProvider, which enables authentication context. All nested components have access to these contexts.
 *
 * @param children - The React nodes to render within the provider chain.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
