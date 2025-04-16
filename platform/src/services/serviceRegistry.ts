import { 
  OutlineGenerator, 
  SlideGenerator, 
  ImageGenerator,
  AIServiceProvider,
  DefaultAIService
} from './aiService';
import { openaiService } from './openaiService';

/**
 * Service Registry for AI Service capability negotiation.
 * This registry allows for dynamic selection of the best service provider
 * based on capabilities, availability, and configuration.
 */
export class AIServiceRegistry {
  private outlineGenerators: Map<string, OutlineGenerator> = new Map();
  private slideGenerators: Map<string, SlideGenerator> = new Map();
  private imageGenerators: Map<string, ImageGenerator> = new Map();
  private availableProviders: Map<string, AIServiceProvider> = new Map();
  
  // Service preferences from user settings or configuration
  private preferences: {
    preferredOutlineService?: string;
    preferredSlideService?: string;
    preferredImageService?: string;
    prioritizeSpeed: boolean;
    prioritizeQuality: boolean;
  } = {
    prioritizeSpeed: false,
    prioritizeQuality: true,
  };

  constructor() {
    // Register services will be called from outside
  }

  /**
   * Register a service for one or more generation tasks
   */
  registerService(
    id: string, 
    service: OutlineGenerator | SlideGenerator | ImageGenerator,
    provider: AIServiceProvider
  ): void {
    // Store provider information
    this.availableProviders.set(id, provider);
    
    // Register for each capability the service supports
    if ('generateOutline' in service && provider.capabilities.generateOutline) {
      this.outlineGenerators.set(id, service as OutlineGenerator);
    }
    
    if ('generateSlides' in service && provider.capabilities.generateSlides) {
      this.slideGenerators.set(id, service as SlideGenerator);
    }
    
    if ('generateImages' in service && provider.capabilities.generateImages) {
      this.imageGenerators.set(id, service as ImageGenerator);
    }
  }

  /**
   * Update user preferences for service selection
   */
  updatePreferences(preferences: Partial<typeof this.preferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
  }

  /**
   * Get the best outline generator based on capabilities and preferences
   */
  getBestOutlineGenerator(): OutlineGenerator {
    // Check if we have a preferred service that's available
    if (
      this.preferences.preferredOutlineService && 
      this.outlineGenerators.has(this.preferences.preferredOutlineService)
    ) {
      return this.outlineGenerators.get(this.preferences.preferredOutlineService)!;
    }
    
    // If prioritizing quality, prefer services with better models
    if (this.preferences.prioritizeQuality && this.outlineGenerators.has('openai')) {
      return this.outlineGenerators.get('openai')!;
    }
    
    // Default to any available service
    for (const [id, service] of this.outlineGenerators.entries()) {
      return service; // Return the first available service
    }
    
    throw new Error('No outline generation service available');
  }

  /**
   * Get the best slide generator based on capabilities and preferences
   */
  getBestSlideGenerator(): SlideGenerator {
    // Check if we have a preferred service that's available
    if (
      this.preferences.preferredSlideService && 
      this.slideGenerators.has(this.preferences.preferredSlideService)
    ) {
      return this.slideGenerators.get(this.preferences.preferredSlideService)!;
    }
    
    // If prioritizing quality, prefer services with better models
    if (this.preferences.prioritizeQuality && this.slideGenerators.has('openai')) {
      return this.slideGenerators.get('openai')!;
    }
    
    // Default to any available service
    for (const [id, service] of this.slideGenerators.entries()) {
      return service; // Return the first available service
    }
    
    throw new Error('No slide generation service available');
  }

  /**
   * Get the best image generator based on capabilities and preferences
   */
  getBestImageGenerator(): ImageGenerator {
    // Check if we have a preferred service that's available
    if (
      this.preferences.preferredImageService && 
      this.imageGenerators.has(this.preferences.preferredImageService)
    ) {
      return this.imageGenerators.get(this.preferences.preferredImageService)!;
    }
    
    // For images, we might have different selection criteria
    // Check for streaming support if speed is prioritized
    if (this.preferences.prioritizeSpeed) {
      for (const [id, service] of this.imageGenerators.entries()) {
        const provider = this.availableProviders.get(id);
        if (provider?.capabilities.streamingSupport) {
          return service;
        }
      }
    }
    
    // If prioritizing quality, prefer services with better image generation
    if (this.preferences.prioritizeQuality && this.imageGenerators.has('openai')) {
      return this.imageGenerators.get('openai')!;
    }
    
    // Default to any available service
    for (const [id, service] of this.imageGenerators.entries()) {
      return service; // Return the first available service
    }
    
    throw new Error('No image generation service available');
  }

  /**
   * Get all registered service providers
   */
  getAvailableProviders(): AIServiceProvider[] {
    return Array.from(this.availableProviders.values());
  }
}

// Create and export a singleton instance
const serviceRegistry = new AIServiceRegistry();

// Register available services
// Create instance of DefaultAIService
const defaultService = new DefaultAIService();

// Register the default service
serviceRegistry.registerService(
  'default', 
  defaultService,
  defaultService.serviceProvider
);

// Register OpenAI service
serviceRegistry.registerService(
  'openai',
  openaiService,
  openaiService.serviceProvider
);

export default serviceRegistry; 