import * as React from 'react';

// Define the theme interface
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// Default theme
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#F59E0B',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
};

// Define the return type for useTheme
export interface UseThemeReturn {
  theme: Theme;
  loading: boolean;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

/**
 * Hook for managing the current theme
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Sets the current theme
  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    // You would normally save this to localStorage or a context
  }, []);

  // This would normally load themes from an API or config
  const availableThemes: Theme[] = [defaultTheme];

  return {
    theme,
    loading,
    setTheme,
    availableThemes,
  };
};

export default useTheme;
