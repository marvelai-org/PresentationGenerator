import { 
  AIServiceProvider, 
  OutlineGenerator, 
  SlideGenerator,
  ImageGenerator,
  OutlineGeneratorInput,
  SlideGeneratorInput,
  ImageGeneratorInput,
  OutlineGeneratorResult,
  SlideGeneratorResult,
  ImageGeneratorResult,
  ProgressCallback,
  ErrorType,
  AIServiceError
} from './aiService';

/**
 * OpenAI service adapter that implements our AI service interfaces
 * for OpenAI-specific API calls.
 */
export class OpenAIService implements OutlineGenerator, SlideGenerator, ImageGenerator {
  private maxRetries = 3;
  private initialBackoffMs = 1000;
  
  public serviceProvider: AIServiceProvider = {
    name: 'OpenAI',
    capabilities: {
      generateOutline: true,
      generateSlides: true,
      generateImages: true,
      streamingSupport: true, // OpenAI supports streaming
    }
  };

  // Error handling for OpenAI-specific errors
  private classifyError(error: any): AIServiceError {
    const serviceError = new Error(error.message || 'Unknown OpenAI service error') as AIServiceError;
    
    if (error.message?.includes('Network') || !navigator.onLine) {
      serviceError.type = ErrorType.NETWORK;
      serviceError.isRetryable = true;
    } else if (error.status === 401) {
      serviceError.type = ErrorType.AUTHENTICATION;
      serviceError.isRetryable = false;
    } else if (error.status === 429 || error.message?.includes('rate limit')) {
      serviceError.type = ErrorType.RATE_LIMIT;
      serviceError.isRetryable = true;
      
      // Parse retry-after header if available
      const retryAfter = error.headers?.get('retry-after');
      serviceError.retryAfter = retryAfter ? parseInt(retryAfter, 10) : 60;
    } else if (error.status === 400) {
      serviceError.type = ErrorType.VALIDATION;
      serviceError.isRetryable = false;
    } else if (error.status >= 500) {
      serviceError.type = ErrorType.SERVER;
      serviceError.isRetryable = true;
    } else {
      serviceError.type = ErrorType.UNKNOWN;
      serviceError.isRetryable = true;
    }
    
    serviceError.status = error.status;
    return serviceError;
  }

  // Helper method for retries with exponential backoff
  private async withRetry<T>(
    operation: () => Promise<T>,
    progressCallback?: ProgressCallback,
    stage?: string
  ): Promise<T> {
    let lastError: AIServiceError | null = null;
    
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        // Update progress if callback is provided
        if (progressCallback && stage) {
          progressCallback({
            stage,
            progress: (attempt / this.maxRetries) * 40, // First 40% is for connection attempts
            message: attempt > 0 ? `Retry attempt ${attempt}...` : 'Connecting to OpenAI...',
            isComplete: false
          });
        }
        
        return await operation();
      } catch (error: any) {
        lastError = this.classifyError(error);
        
        // If error is not retryable, throw immediately
        if (!lastError.isRetryable) {
          throw lastError;
        }
        
        // Calculate backoff with exponential increase
        const backoffMs = this.initialBackoffMs * Math.pow(2, attempt);
        
        // If this is not the last attempt, wait and retry
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
      }
    }
    
    // If we've exhausted all retries, throw the last error
    throw lastError || new Error('Operation failed after multiple retries');
  }

  // OpenAI-specific implementation for outline generation
  async generateOutline(
    input: OutlineGeneratorInput,
    progressCallback?: ProgressCallback
  ): Promise<OutlineGeneratorResult> {
    return this.withRetry(async () => {
      // Start progress
      if (progressCallback) {
        progressCallback({
          stage: 'Outline Generation',
          progress: 0,
          message: 'Starting OpenAI outline generation...',
          isComplete: false
        });
      }

      // In a real implementation, this would call the OpenAI API directly
      // For now, we'll use our API proxy for OpenAI
      const response = await fetch('/api/openai/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: input.topic,
          numSlides: input.n_slides,
          instructional_level: input.instructional_level,
          language: input.lang || 'en',
          model: 'gpt-4', // OpenAI-specific parameter
        }),
      });

      // Progress update
      if (progressCallback) {
        progressCallback({
          stage: 'Outline Generation',
          progress: 50,
          message: 'Processing outline from OpenAI...',
          isComplete: false
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;

        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText };
        }

        throw new Error(errorData.detail || 'Failed to generate outline with OpenAI');
      }

      const data = await response.json();

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Outline Generation',
          progress: 100,
          message: 'OpenAI outline generation complete!',
          isComplete: true
        });
      }

      return {
        slides: data.slides.map(slide => slide.title),
        status: 'success'
      };
    }, progressCallback, 'OpenAI Outline Generation');
  }

  // OpenAI-specific implementation for slide generation
  async generateSlides(
    input: SlideGeneratorInput,
    progressCallback?: ProgressCallback
  ): Promise<SlideGeneratorResult> {
    return this.withRetry(async () => {
      // Start progress
      if (progressCallback) {
        progressCallback({
          stage: 'Slide Content Generation',
          progress: 0,
          message: 'Starting OpenAI slide content generation...',
          isComplete: false
        });
      }

      // In a real implementation, this would call the OpenAI API directly
      const response = await fetch('/api/openai/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides_titles: input.slides_titles,
          topic: input.topic,
          instructional_level: input.instructional_level,
          lang: input.lang || 'en',
          model: 'gpt-4', // OpenAI-specific parameter
        }),
      });

      // Progress update for streaming responses
      if (progressCallback && this.serviceProvider.capabilities.streamingSupport) {
        // With streaming, we can provide more detailed progress
        const reader = response.body?.getReader();
        let receivedLength = 0;
        const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
        
        if (reader && contentLength) {
          const decoder = new TextDecoder();
          let accumulated = '';
          
          while(true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            receivedLength += value.length;
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;
            
            // Update progress based on streaming chunks
            const progress = Math.min(50 + (receivedLength / contentLength) * 50, 99);
            progressCallback({
              stage: 'Slide Content Generation',
              progress,
              message: `Receiving slide content (${Math.round(progress)}%)...`,
              isComplete: false
            });
          }
          
          // Parse the accumulated response
          try {
            const data = JSON.parse(accumulated);
            
            if (!data || !data.slides || !Array.isArray(data.slides)) {
              throw new Error('Invalid data structure received from OpenAI API');
            }
            
            // Complete progress
            progressCallback({
              stage: 'Slide Content Generation',
              progress: 100,
              message: 'OpenAI slide content generation complete!',
              isComplete: true
            });
            
            return {
              slides: data.slides,
              status: 'success'
            };
          } catch (e) {
            throw new Error('Failed to parse streaming response');
          }
        }
      }

      // Non-streaming fallback
      if (!response.ok) {
        let errorMessage = 'Failed to generate slides with OpenAI';

        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = (await response.text()) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (!data || !data.slides || !Array.isArray(data.slides)) {
        throw new Error('Invalid data structure received from OpenAI API');
      }

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Slide Content Generation',
          progress: 100,
          message: 'OpenAI slide content generation complete!',
          isComplete: true
        });
      }

      return {
        slides: data.slides,
        status: 'success'
      };
    }, progressCallback, 'OpenAI Slide Content Generation');
  }

  // OpenAI-specific implementation for image generation using DALL-E
  async generateImages(
    input: ImageGeneratorInput,
    progressCallback?: ProgressCallback
  ): Promise<ImageGeneratorResult> {
    try {
      // Start progress
      if (progressCallback) {
        progressCallback({
          stage: 'Image Generation',
          progress: 0,
          message: 'Starting DALL-E image generation...',
          isComplete: false
        });
      }

      // Process slides in parallel with a concurrency limit
      const batchSize = 3; // Process 3 images at a time
      const results = [];
      
      for (let i = 0; i < input.slides.length; i += batchSize) {
        const batch = input.slides.slice(i, i + batchSize);
        
        // Update progress based on batch
        if (progressCallback) {
          const batchProgress = (i / input.slides.length) * 100;
          progressCallback({
            stage: 'Image Generation',
            progress: batchProgress,
            message: `Generating images for batch ${Math.floor(i / batchSize) + 1}...`,
            isComplete: false
          });
        }
        
        // Process this batch
        const batchPromises = batch.map(async (slide) => {
          try {
            const response = await this.withRetry(async () => {
              return await fetch('/api/openai/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: slide.title + ' - ' + slide.content,
                  model: 'dall-e-3', // OpenAI-specific parameter
                }),
              });
            });

            if (!response.ok) {
              const errorData = await response
                .json()
                .catch(() => ({ detail: `HTTP Error: ${response.status} ${response.statusText}` }));

              throw new Error(
                errorData.detail || `Failed to generate image: ${response.status} ${response.statusText}`
              );
            }

            const data = await response.json();
            return {
              ...slide,
              image_url: data.url,
              image_status: 'success',
            };
          } catch (error) {
            // Handle individual slide failure but continue with others
            console.error(`Error generating image for slide "${slide.title}":`, error);
            return {
              ...slide,
              image_url: null,
              image_status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        });
        
        // Wait for all slides in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Image Generation',
          progress: 100,
          message: 'DALL-E image generation complete!',
          isComplete: true
        });
      }

      // Check if all images were successful or partial success
      const hasErrors = results.some(slide => slide.image_status === 'error');
      
      return {
        slides: results,
        status: hasErrors ? 'partial' : 'success',
        error: hasErrors ? 'Some images failed to generate' : undefined
      };
    } catch (error) {
      console.error('Error in DALL-E image generation:', error);

      // Degraded mode - return slides without images but don't throw
      return {
        status: 'partial',
        error: error instanceof Error ? error.message : 'Unknown error',
        slides: input.slides.map(slide => ({
          ...slide,
          image_url: null,
          image_status: 'error',
        })),
      };
    }
  }
}

// Export instance for service registry
export const openaiService = new OpenAIService(); 