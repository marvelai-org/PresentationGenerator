/**
 * Represents an AI model option
 */
export interface AIModelOption {
  /** Unique identifier for the model */
  key: string;
  /** Display name of the model */
  name: string;
  /** The company/organization that provides this model */
  provider: string;
  /** Brief description of the model */
  description: string;
  /** Array of strengths or use cases */
  bestFor: string[];
  /** Relative speed rating (1-4, with 4 being fastest) */
  speed: number;
}

/**
 * Categorized AI model options for image generation
 */
export const aiModelOptions = {
  basic: [
    {
      key: 'Flux Fast 1.1',
      name: 'Flux Fast 1.1',
      provider: 'Black Forest Labs',
      description: 'Fast speed with bright, vivid colors',
      bestFor: ['Realistic styles', 'Colors'],
      speed: 4,
    },
    {
      key: 'Imagen 3 Fast',
      name: 'Imagen 3 Fast',
      provider: 'Google',
      description: "Google's fastest image generation model",
      bestFor: ['Accuracy', 'Speed'],
      speed: 4,
    },
  ],
  advanced: [
    {
      key: 'Flux Pro',
      name: 'Flux Pro',
      provider: 'Black Forest Labs',
      description: 'Premium quality with more detailed outputs',
      bestFor: ['Details', 'Composition'],
      speed: 3,
    },
    {
      key: 'Ideogram 2 Turbo',
      name: 'Ideogram 2 Turbo',
      provider: 'Ideogram',
      description: 'Fast generation with high quality',
      bestFor: ['Text integration', 'Concepts'],
      speed: 3,
    },
    {
      key: 'Imagen 3',
      name: 'Imagen 3',
      provider: 'Google',
      description: 'High-quality image generation from text',
      bestFor: ['Photorealism', 'Accuracy'],
      speed: 2,
    },
    {
      key: 'Leonardo Phoenix',
      name: 'Leonardo Phoenix',
      provider: 'Leonardo',
      description: 'High-detail image creation',
      bestFor: ['Artistic quality', 'Details'],
      speed: 2,
    },
  ],
  premium: [
    {
      key: 'DALL-E 3',
      name: 'DALL-E 3',
      provider: 'OpenAI',
      description: 'Powerful text-to-image capabilities',
      bestFor: ['Text accuracy', 'Creative concepts'],
      speed: 2,
    },
    {
      key: 'Flux Ultra',
      name: 'Flux Ultra',
      provider: 'Black Forest Labs',
      description: 'The highest quality generation',
      bestFor: ['Photorealism', 'Details'],
      speed: 1,
    },
    {
      key: 'Ideogram 2',
      name: 'Ideogram 2',
      provider: 'Ideogram',
      description: 'The most powerful model from Ideogram',
      bestFor: ['Text integration', 'Creativity'],
      speed: 2,
    },
    {
      key: 'Recraft',
      name: 'Recraft',
      provider: 'Recraft',
      description: 'Great for creative styles',
      bestFor: ['Artistic styles', 'Colors'],
      speed: 2,
    },
    {
      key: 'Recraft Vector Illustration',
      name: 'Recraft Vector Illustration',
      provider: 'Recraft',
      description: 'Great for line art and engravings',
      bestFor: ['Artistic styles', 'Text'],
      speed: 2,
    },
  ],
};
