/**
 * Represents a presentation theme
 */
export interface Theme {
  /** Unique identifier for the theme */
  id: string;
  /** Display name of the theme */
  name: string;
  /** Background color in hex format */
  backgroundColor: string;
  /** Title text color in hex format */
  titleColor: string;
  /** Body text color in hex format */
  bodyColor: string;
  /** Link color in hex format */
  linkColor: string;
  /** Whether this is a dark theme */
  isDark: boolean;
}

/**
 * Categorization of themes by type
 */
export type ThemeFilter = 'all' | 'dark' | 'light' | 'professional' | 'colorful';

/**
 * Props for theme selection component
 */
export interface ThemeSelectionProps {
  /** All available themes */
  themes: Theme[];
  /** Currently selected theme */
  selectedTheme: Theme;
  /** Callback for when a theme is selected */
  onThemeSelect: (theme: Theme) => void;
}
