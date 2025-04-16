// src/services/aiService.ts

// Service Input Interfaces
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

// Service Result Interfaces
export interface OutlineGeneratorResult {
  slides: string[];
  status: 'success' | 'error' | 'partial';
  error?: string;
}

export interface SlideGeneratorResult {
  slides: Array<any>;
  status: 'success' | 'error' | 'partial';
  error?: string;
}

export interface ImageGeneratorResult {
  slides: Array<any>;
  status: 'success' | 'error' | 'partial';
  error?: string;
}

// Progress Tracking Interfaces
export interface ProgressInfo {
  stage: string;
  progress: number; // 0-100
  message?: string;
  isComplete: boolean;
}

export type ProgressCallback = (progress: ProgressInfo) => void;

// Service Interface definitions
export interface AIServiceProvider {
  name: string;
  capabilities: {
    generateOutline: boolean;
    generateSlides: boolean;
    generateImages: boolean;
    streamingSupport: boolean;
  };
}

export interface OutlineGenerator {
  generateOutline(input: OutlineGeneratorInput, progressCallback?: ProgressCallback): Promise<OutlineGeneratorResult>;
}

export interface SlideGenerator {
  generateSlides(input: SlideGeneratorInput, progressCallback?: ProgressCallback): Promise<SlideGeneratorResult>;
}

export interface ImageGenerator {
  generateImages(input: ImageGeneratorInput, progressCallback?: ProgressCallback): Promise<ImageGeneratorResult>;
}

// Error Classification
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  VALIDATION = 'validation',
  SERVER = 'server',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown'
}

export interface AIServiceError extends Error {
  type: ErrorType;
  isRetryable: boolean;
  status?: number;
  retryAfter?: number;
}

// Default API Service implementation
export class DefaultAIService implements OutlineGenerator, SlideGenerator, ImageGenerator {
  // Use numeric IP to avoid DNS issues
  private API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL ? 
    process.env.NEXT_PUBLIC_AI_SERVICE_URL.replace('localhost', '127.0.0.1') : 
    'http://127.0.0.1:8000';
  private maxRetries = 3;
  private initialBackoffMs = 1000;

  public serviceProvider: AIServiceProvider = {
    name: 'Default',
    capabilities: {
      generateOutline: true,
      generateSlides: true,
      generateImages: true,
      streamingSupport: false,
    }
  };

  // Helper method for error handling
  private classifyError(error: any): AIServiceError {
    const serviceError = new Error(error.message || 'Unknown service error') as AIServiceError;
    
    if (error.message?.includes('Network') || !navigator.onLine) {
      serviceError.type = ErrorType.NETWORK;
      serviceError.isRetryable = true;
    } else if (error.status === 401 || error.message?.includes('API key')) {
      serviceError.type = ErrorType.AUTHENTICATION;
      serviceError.isRetryable = false;
    } else if (error.status === 429) {
      serviceError.type = ErrorType.RATE_LIMIT;
      serviceError.isRetryable = true;
      serviceError.retryAfter = 30; // Default 30 seconds
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
            message: attempt > 0 ? `Retry attempt ${attempt}...` : 'Connecting...',
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
          message: 'Starting outline generation...',
          isComplete: false
        });
      }

      const response = await fetch('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: input.topic,
          numSlides: input.n_slides,
          instructional_level: input.instructional_level,
          language: input.lang || 'en'
        }),
      });

      // Progress update
      if (progressCallback) {
        progressCallback({
          stage: 'Outline Generation',
          progress: 50,
          message: 'Processing outline...',
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

        throw new Error(errorData.detail || 'Failed to generate outline');
      }

      const data = await response.json();

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Outline Generation',
          progress: 100,
          message: 'Outline generation complete!',
          isComplete: true
        });
      }

      return {
        slides: data.slides.map(slide => slide.title),
        status: 'success'
      };
    }, progressCallback, 'Outline Generation');
  }

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
          message: 'Starting slide content generation...',
          isComplete: false
        });
      }

      const response = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides_titles: input.slides_titles,
          topic: input.topic,
          instructional_level: input.instructional_level,
          lang: input.lang || 'en'
        }),
      });

      // Progress update
      if (progressCallback) {
        progressCallback({
          stage: 'Slide Content Generation',
          progress: 50,
          message: 'Processing slide content...',
          isComplete: false
        });
      }

      if (!response.ok) {
        let errorMessage = 'Failed to generate slides';

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
        throw new Error('Invalid data structure received from API');
      }

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Slide Content Generation',
          progress: 100,
          message: 'Slide content generation complete!',
          isComplete: true
        });
      }

      return {
        slides: data.slides,
        status: 'success'
      };
    }, progressCallback, 'Slide Content Generation');
  }

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
          message: 'Starting image generation...',
          isComplete: false
        });
      }

      const response = await this.withRetry(async () => {
        return await fetch('/api/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
      }, progressCallback, 'Image Generation');

      // Progress update
      if (progressCallback) {
        progressCallback({
          stage: 'Image Generation',
          progress: 50,
          message: 'Processing images...',
          isComplete: false
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: `HTTP Error: ${response.status} ${response.statusText}` }));

        throw new Error(
          errorData.detail || `Failed to generate images: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Complete progress
      if (progressCallback) {
        progressCallback({
          stage: 'Image Generation',
          progress: 100,
          message: 'Image generation complete!',
          isComplete: true
        });
      }

      return {
        slides: data.slides,
        status: 'success'
      };
    } catch (error) {
      console.error('Error generating images:', error);

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

// Helper functions that lazily load the service registry to avoid circular dependencies
let serviceRegistryPromise: Promise<any> | null = null;

// Wrapper functions that use dynamic imports to avoid circular dependencies
export async function generateOutline(
  input: OutlineGeneratorInput, 
  progressCallback?: ProgressCallback
): Promise<OutlineGeneratorResult> {
  // Lazily import the service registry to avoid circular dependencies
  if (!serviceRegistryPromise) {
    serviceRegistryPromise = import('./serviceRegistry').then(module => module.default);
  }
  
  const serviceRegistry = await serviceRegistryPromise;
  const generator = serviceRegistry.getBestOutlineGenerator();
  return generator.generateOutline(input, progressCallback);
}

export async function generateSlides(
  input: SlideGeneratorInput,
  progressCallback?: ProgressCallback
): Promise<SlideGeneratorResult> {
  // Lazily import the service registry to avoid circular dependencies
  if (!serviceRegistryPromise) {
    serviceRegistryPromise = import('./serviceRegistry').then(module => module.default);
  }
  
  const serviceRegistry = await serviceRegistryPromise;
  const generator = serviceRegistry.getBestSlideGenerator();
  return generator.generateSlides(input, progressCallback);
}

export async function generateImages(
  input: ImageGeneratorInput,
  progressCallback?: ProgressCallback
): Promise<ImageGeneratorResult> {
  // Lazily import the service registry to avoid circular dependencies
  if (!serviceRegistryPromise) {
    serviceRegistryPromise = import('./serviceRegistry').then(module => module.default);
  }
  
  const serviceRegistry = await serviceRegistryPromise;
  const generator = serviceRegistry.getBestImageGenerator();
  return generator.generateImages(input, progressCallback);
}
