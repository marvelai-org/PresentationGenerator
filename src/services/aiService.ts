// src/services/aiService.ts
export interface OutlineGeneratorInput {
  topic: string;
  n_slides: number;
  instructional_level: string;
  lang?: string;
  file_url?: string;
  file_type?: string;
}

export interface SlideGeneratorInput {
  slides_titles: string[];
  topic: string;
  instructional_level: string;
  lang?: string;
}

export interface ImageGeneratorInput {
  slides: Array<any>;
}

const API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function generateOutline(input: OutlineGeneratorInput): Promise<string[]> {
  try {
    console.log('Calling outline generation API with:', input);
    const response = await fetch('/api/outline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: input.topic,
        numSlides: input.n_slides,
        instructional_level: input.instructional_level,
        language: input.lang || 'en'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;

      try {
        // Try to parse as JSON first
        errorData = JSON.parse(errorText);
      } catch (e) {
        // If not JSON, use text as is
        errorData = { detail: errorText };
      }

      if (errorText.includes('No API keys found')) {
        throw new Error(
          'Backend service is missing API keys. Please check the server configuration.'
        );
      }

      throw new Error(errorData.detail || 'Failed to generate outline');
    }

    const data = await response.json();

    return data.slides.map(slide => slide.title);
  } catch (error) {
    console.error('Error generating outline:', error);
    throw error;
  }
}

export async function generateSlides(input: SlideGeneratorInput): Promise<any[]> {
  try {
    console.log('Calling slide generation API with:', input);
    const response = await fetch('/api/slides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slides_titles: input.slides_titles,
        topic: input.topic,
        instructional_level: input.instructional_level,
        lang: input.lang || 'en'
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to generate slides';

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.detail || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use text content
        errorMessage = (await response.text()) || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data || !data.slides || !Array.isArray(data.slides)) {
      console.error('Invalid data structure received:', data);
      throw new Error('Invalid data structure received from API');
    }

    return data.slides;
  } catch (error) {
    console.error('Error generating slides:', error);
    throw error;
  }
}

export async function generateImages(input: ImageGeneratorInput): Promise<any> {
  try {
    console.log('Calling image generation API with:', input);
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: `HTTP Error: ${response.status} ${response.statusText}` }));

      console.error('Image generation API error:', errorData);
      throw new Error(
        errorData.detail || `Failed to generate images: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('Image generation API response:', data);
    return data;
  } catch (error) {
    console.error('Error generating images:', error);

    // Return a structured error response instead of throwing
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      slides: input.slides.map(slide => ({
        ...slide,
        image_url: null,
        image_status: 'error',
      })),
    };
  }
}
