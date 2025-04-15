import { useState, useEffect } from 'react';

// Theme interface
export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  titleColor?: string;
  textColor?: string;
  bodyColor?: string;
  linkColor?: string;
  accentColor?: string;
  fontFamily?: string;
  isDark?: boolean;
}

// Default theme
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  backgroundColor: '#FFFFFF',
  titleColor: '#000000',
  bodyColor: '#333333',
  linkColor: '#2563EB',
  isDark: false,
};

// Available themes
export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Default Theme',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#3b82f6',
    fontFamily: 'Arial, sans-serif',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    backgroundColor: '#121212',
    textColor: '#ffffff',
    accentColor: '#bb86fc',
    fontFamily: 'Arial, sans-serif',
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    backgroundColor: '#f0f9ff',
    textColor: '#0c4a6e',
    accentColor: '#0ea5e9',
    fontFamily: 'Helvetica, sans-serif',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    backgroundColor: '#f0fdf4',
    textColor: '#166534',
    accentColor: '#22c55e',
    fontFamily: 'Georgia, serif',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    backgroundColor: '#fef2f2',
    textColor: '#991b1b',
    accentColor: '#f59e0b',
    fontFamily: 'Verdana, sans-serif',
  },
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load theme from localStorage or API
  useEffect(() => {
    const loadTheme = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get theme from localStorage first
        const savedThemeData = localStorage.getItem('presentationTheme');

        if (savedThemeData) {
          try {
            const parsedTheme = JSON.parse(savedThemeData);

            setTheme(parsedTheme);
            setLoading(false);

            return;
          } catch (parseError) {
            console.error('Error parsing saved theme:', parseError);
            // Continue to fetch from API if parse fails
          }
        }

        // If no localStorage theme or parsing failed, try to get from API
        const savedThemeId = localStorage.getItem('selectedThemeId');

        if (savedThemeId) {
          const response = await fetch(`/api/theme?id=${savedThemeId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch theme data');
          }

          const data = await response.json();

          if (data.theme) {
            setTheme(data.theme);
            // Also save to localStorage for faster access next time
            localStorage.setItem('presentationTheme', JSON.stringify(data.theme));
          }
        }
      } catch (loadError) {
        console.error('Error loading theme:', loadError);
        setError('Failed to load theme data');
        // Fall back to default theme
        setTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Function to change theme
  const changeTheme = async (newTheme: Theme) => {
    try {
      setTheme(newTheme);
      localStorage.setItem('selectedThemeId', newTheme.id);
      localStorage.setItem('presentationTheme', JSON.stringify(newTheme));

      // Optionally also save to API
      await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      // Continue anyway since we already saved to localStorage
    }
  };

  return {
    theme,
    loading,
    error,
    changeTheme,
  };
}
