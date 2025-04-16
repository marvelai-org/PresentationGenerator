import { useCallback } from 'react';

import { THEME_STORAGE_KEY } from '../constants/storage';

import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeSelectionReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Hook to manage theme selection and persistence
 * @returns Object containing theme state and setter functions
 */
export function useThemeSelection(): ThemeSelectionReturn {
  const [theme, setThemeStorage] = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system');

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Remove all existing theme classes
    root.classList.remove('light', 'dark');

    // Apply the new theme
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  }, []);

  // Set theme and apply it
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeStorage(newTheme);
      applyTheme(newTheme);
    },
    [applyTheme, setThemeStorage]
  );

  // Toggle between light and dark (ignoring system)
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
