import { OutlineApiResponse, GenerateOutlineParams } from '../types';

/**
 * Generates an outline for a presentation based on the provided parameters
 *
 * @param topic - Topic for the presentation
 * @param numSlides - Number of slides to generate
 * @param style - Style of the presentation
 * @param language - Language for the presentation content
 * @param themeId - Optional theme ID to use
 * @param textDensity - Optional text density (Concise, Medium, Detailed)
 * @param imageSource - Optional image source setting
 * @param aiModel - Optional AI model to use for generation
 * @returns Promise with an array of OutlineApiResponse objects
 */
export async function generateOutline(
  topic: string,
  numSlides: number,
  style: string,
  language: string,
  themeId?: string,
  textDensity?: string,
  imageSource?: string,
  aiModel?: string
): Promise<OutlineApiResponse[]> {
  try {
    const response = await fetch('/api/outline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        numSlides,
        style,
        language,
        themeId,
        textDensity,
        imageSource,
        aiModel,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate outline');
    }

    const data = await response.json();

    return data.slides as OutlineApiResponse[];
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
}

/**
 * Simplified function to generate an outline
 *
 * @param params - GenerateOutlineParams object
 * @returns Promise with an array of OutlineApiResponse objects
 */
export async function generateOutlineWithParams(
  params: GenerateOutlineParams
): Promise<OutlineApiResponse[]> {
  return generateOutline(
    params.topic,
    params.numSlides,
    params.style,
    params.language,
    params.themeId,
    params.textDensity,
    params.imageSource,
    params.aiModel
  );
}
