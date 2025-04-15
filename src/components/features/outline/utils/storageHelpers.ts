import { SlideContent, Theme } from '../types';

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  SELECTED_THEME_ID: 'selectedThemeId',
  LAST_PROMPT: 'lastPrompt',
  PRESENTATION_SETTINGS: 'presentationSettings',
  PRESENTATION_OUTLINE: 'presentationOutline',
  PRESENTATION_THEME: 'presentationTheme',
  IMAGE_SOURCE: 'imageSource',
  IMAGE_MODEL_ID: 'imageModelId',
};

/**
 * Interface for presentation settings stored in localStorage
 */
export interface PresentationSettings {
  outline: SlideContent[];
  theme: Theme;
  textDensity: string;
  imageSource: string;
  aiModel: string;
}

/**
 * Save the selected theme ID to localStorage
 *
 * @param themeId - ID of the selected theme
 */
export const saveSelectedThemeId = (themeId: string): void => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_THEME_ID, themeId);
};

/**
 * Get the selected theme ID from localStorage
 *
 * @returns The selected theme ID or null if not found
 */
export const getSelectedThemeId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_THEME_ID);
};

/**
 * Save the last used prompt to localStorage
 *
 * @param prompt - The last used prompt
 */
export const saveLastPrompt = (prompt: string): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_PROMPT, prompt);
};

/**
 * Get the last used prompt from localStorage
 *
 * @returns The last used prompt or null if not found
 */
export const getLastPrompt = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_PROMPT);
};

/**
 * Save presentation settings to localStorage
 *
 * @param settings - The presentation settings to save
 */
export const savePresentationSettings = (settings: PresentationSettings): void => {
  localStorage.setItem(STORAGE_KEYS.PRESENTATION_SETTINGS, JSON.stringify(settings));
  localStorage.setItem(STORAGE_KEYS.PRESENTATION_OUTLINE, JSON.stringify(settings.outline));
  localStorage.setItem(STORAGE_KEYS.PRESENTATION_THEME, JSON.stringify(settings.theme));
};

/**
 * Get presentation settings from localStorage
 *
 * @returns The presentation settings or null if not found
 */
export const getPresentationSettings = (): PresentationSettings | null => {
  const settingsString = localStorage.getItem(STORAGE_KEYS.PRESENTATION_SETTINGS);

  if (!settingsString) return null;

  try {
    return JSON.parse(settingsString) as PresentationSettings;
  } catch (error) {
    console.error('Error parsing presentation settings:', error);

    return null;
  }
};

/**
 * Save image source settings to localStorage
 *
 * @param imageSource - The image source setting
 * @param imageModelId - The image model ID
 */
export const saveImageSettings = (imageSource: string, imageModelId: string): void => {
  localStorage.setItem(STORAGE_KEYS.IMAGE_SOURCE, imageSource);
  localStorage.setItem(STORAGE_KEYS.IMAGE_MODEL_ID, imageModelId);
};
