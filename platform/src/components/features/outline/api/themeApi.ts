import { Theme } from '../types';

/**
 * Function to fetch available themes from the API
 *
 * @returns Promise with an array of Theme objects
 */
export async function fetchAvailableThemes(): Promise<Theme[]> {
  try {
    const response = await fetch('/api/themes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }

    const data = await response.json();

    return data.themes as Theme[];
  } catch (error) {
    console.error('Error fetching themes:', error);
    throw error;
  }
}

/**
 * Function to fetch a specific theme by ID
 *
 * @param themeId - ID of the theme to fetch
 * @returns Promise with a Theme object
 */
export async function fetchThemeById(themeId: string): Promise<Theme> {
  try {
    const response = await fetch(`/api/themes/${themeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch theme with ID ${themeId}`);
    }

    const data = await response.json();

    return data.theme as Theme;
  } catch (error) {
    console.error(`Error fetching theme with ID ${themeId}:`, error);
    throw error;
  }
}
