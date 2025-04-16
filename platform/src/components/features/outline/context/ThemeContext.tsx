'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { Theme, themes as importedThemes } from '@/hooks/useTheme';

// Default themes in case the import fails
const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default Theme',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    fontFamily: 'Arial, sans-serif',
  },
];

// Use imported themes if available, otherwise use default
const themes = importedThemes || defaultThemes;

interface ThemeContextType {
  // Theme state
  themes: Theme[];
  selectedTheme: Theme;
  themeFilter: string;

  // Theme operations
  selectTheme: (theme: Theme) => void;
  setThemeFilter: (filter: string) => void;

  // Modal state
  showThemeModal: boolean;
  openThemeModal: () => void;
  closeThemeModal: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0] || defaultThemes[0]); // Default to first theme, fallback to default
  const [themeFilter, setThemeFilter] = useState<string>('all');

  // Modal state
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  // Load selected theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('selectedThemeId');

    if (savedThemeId) {
      const savedTheme = themes.find(theme => theme.id === savedThemeId);

      if (savedTheme) {
        setSelectedTheme(savedTheme);
      }
    }
  }, []);

  // Select theme and save to localStorage
  const selectTheme = useCallback((theme: Theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedThemeId', theme.id);
  }, []);

  // Modal controls
  const openThemeModal = useCallback(() => {
    setShowThemeModal(true);
  }, []);

  const closeThemeModal = useCallback(() => {
    setShowThemeModal(false);
  }, []);

  const contextValue: ThemeContextType = {
    themes,
    selectedTheme,
    themeFilter,
    selectTheme,
    setThemeFilter,
    showThemeModal,
    openThemeModal,
    closeThemeModal,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }

  return context;
}
