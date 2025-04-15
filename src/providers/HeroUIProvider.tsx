'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { HeroUIProvider as BaseHeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// Extend the HeroUIProvider props to include theme property
interface ExtendedHeroUIProviderProps {
  children: React.ReactNode;
  navigate: (href: string, options?: any) => void;
  theme?: {
    colors: {
      primary: Record<string, string>;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export function HeroUIProvider({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  // Create custom theme with purple as primary color
  const theme = {
    colors: {
      primary: {
        50: '#F2EAFA',
        100: '#E4D4F4',
        200: '#C9A9E9',
        300: '#AE7EDE',
        400: '#9353D3',
        500: '#7828C8',
        600: '#6020A0',
        700: '#481878',
        800: '#301050',
        900: '#180828',
      },
    },
  };

  // Cast the component to accept our extended props
  const TypedHeroUIProvider =
    BaseHeroUIProvider as React.ComponentType<ExtendedHeroUIProviderProps>;

  return (
    <TypedHeroUIProvider navigate={router.push} theme={theme}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </TypedHeroUIProvider>
  );
}
