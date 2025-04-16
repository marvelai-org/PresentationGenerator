'use client';

import { ReactNode } from 'react';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { HeroUIProvider } from '@/providers/HeroUIProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { PersistenceProvider } from '@/providers/PersistenceProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
        <AuthProvider>
          <PersistenceProvider>{children}</PersistenceProvider>
        </AuthProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
