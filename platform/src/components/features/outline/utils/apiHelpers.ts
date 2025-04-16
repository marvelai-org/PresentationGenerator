import { SlideContent } from '../types';

/**
 * API response interface for outline generation
 */
interface OutlineGenerationResponse {
  slides: SlideContent[];
  message?: string;
}

/**
 * Generate an outline of slides based on a prompt
 *
 * @param prompt The user's prompt to generate an outline from
 * @param numSlides The number of slides to generate
 * @returns Promise with the generated slides and a message
 */
export async function generateOutline(
  prompt: string,
  numSlides: number = 8
): Promise<OutlineGenerationResponse> {
  try {
    const response = await fetch('/api/generate/outline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        numSlides,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Failed to generate outline');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
}
