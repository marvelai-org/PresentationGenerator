import { useState, useCallback } from 'react';

import { SlideContent } from '../types';
import { generateOutline } from '../utils/apiHelpers';
import { saveLastPrompt } from '../utils/storageHelpers';
import { getNumSlidesFromParam } from '../utils/slideFormatter';

/**
 * Hook for managing outline/presentation generation from a user prompt
 *
 * @returns Object with generation state and functions
 */
export function useOutlineGeneration() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  /**
   * Update the prompt state
   *
   * @param {string} newPrompt New prompt value
   */
  const updatePrompt = useCallback((newPrompt: string) => {
    setPrompt(newPrompt);
    setError(null);
  }, []);

  /**
   * Generate slide content from the current prompt
   *
   * @param {string} slideParam Optional slide parameter (e.g., "8 cards")
   * @returns {Promise<SlideContent[] | null>} Generated slides or null if failed
   */
  const generateSlides = useCallback(
    async (slideParam?: string): Promise<SlideContent[] | null> => {
      if (!prompt.trim()) {
        setError('Please enter a prompt to generate an outline.');

        return null;
      }

      try {
        setIsGenerating(true);
        setError(null);

        // Save the prompt to localStorage for later use
        saveLastPrompt(prompt);

        // Determine the number of slides to generate
        const numSlides = slideParam ? getNumSlidesFromParam(slideParam) : 8;

        // Call the API to generate the outline
        const result = await generateOutline(prompt, numSlides);

        if (result.message) {
          setResponseMessage(result.message);
        }

        setIsGenerating(false);

        return result.slides || null;
      } catch (err) {
        setIsGenerating(false);
        setError(err instanceof Error ? err.message : 'Failed to generate outline.');

        return null;
      }
    },
    [prompt]
  );

  /**
   * Reset generation state (error, message)
   */
  const resetGenerationState = useCallback(() => {
    setError(null);
    setResponseMessage('');
  }, []);

  return {
    prompt,
    isGenerating,
    error,
    responseMessage,
    updatePrompt,
    generateSlides,
    resetGenerationState,
  };
}
