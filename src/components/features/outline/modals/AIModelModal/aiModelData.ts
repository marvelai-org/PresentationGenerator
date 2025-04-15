// Types for AI model details
export interface AIModelDetails {
  key: string;
  name: string;
  provider: string;
  description: string;
  bestFor: string[];
  speed: number;
  exampleImage?: string;
}

export interface AIModelGroup {
  basic: AIModelDetails[];
  advanced: AIModelDetails[];
  premium: AIModelDetails[];
}

// AI model options data
export const aiModelOptions: AIModelGroup = {
  basic: [
    {
      key: 'Flux Fast 1.1',
      name: 'Flux Fast 1.1',
      provider: 'Black Forest Labs',
      description:
        'Fast generation model with excellent prompt adherence and vivid colors. Optimized for quick iterations while maintaining high-quality outputs.',
      bestFor: ['Realistic styles', 'Colors'],
      speed: 4,
      exampleImage:
        'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Imagen 3 Fast',
      name: 'Imagen 3 Fast',
      provider: 'Google',
      description:
        "Google's accelerated text-to-image model with reduced latency. Maintains strong detail recognition and prompt following for complex compositions.",
      bestFor: ['Artistic styles', 'Colors'],
      speed: 4,
      exampleImage:
        'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'stable-diffusion-3',
      name: 'Stable Diffusion 3',
      provider: 'Stability AI',
      description:
        '2 billion parameter model with improved performance in typography and complex prompts. Excels at photorealism and detailed compositions with accurate text rendering.',
      bestFor: ['Text', 'Photorealism'],
      speed: 3,
      exampleImage:
        'https://images.unsplash.com/photo-1614315517650-3771cf72d18a?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'ideogram-v2a-turbo',
      name: 'Ideogram v2a Turbo',
      provider: 'Ideogram AI',
      description:
        "Faster and cost-effective version of Ideogram's popular model. Maintains strong text rendering capabilities with reduced generation times for rapid workflows.",
      bestFor: ['Speed', 'Text'],
      speed: 4,
      exampleImage:
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    },
  ],
  advanced: [
    {
      key: 'Flux Pro',
      name: 'Flux Pro',
      provider: 'Black Forest Labs',
      description:
        '12B parameter hybrid architecture combining multimodal and parallel diffusion transformers. Delivers top-tier prompt following, visual quality, and detailed human features.',
      bestFor: ['Realistic styles', 'People, faces, text'],
      speed: 3,
      exampleImage:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Ideogram 2 Turbo',
      name: 'Ideogram 2a Turbo',
      provider: 'Ideogram',
      description:
        "Optimized for faster generation while maintaining Ideogram's signature text clarity. Well-suited for designs requiring readable typography with accelerated processing.",
      bestFor: ['Artistic styles', 'Text'],
      speed: 3,
      exampleImage:
        'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Imagen 3',
      name: 'Imagen 3',
      provider: 'Google',
      description:
        "Google's highest quality text-to-image model with exceptional detail rendering. Capable of generating images with rich lighting, fine details, and natural compositions.",
      bestFor: ['Realistic styles', 'People, colors'],
      speed: 2,
      exampleImage:
        'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Leonardo Phoenix',
      name: 'Leonardo Phoenix',
      provider: 'Leonardo',
      description:
        'Professional-grade model with excellent creative style capabilities. Specializes in unique artistic interpretations while maintaining high-fidelity text and character rendering.',
      bestFor: ['Artistic styles', 'Text'],
      speed: 2,
      exampleImage:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=80',
    },
  ],
  premium: [
    {
      key: 'DALL-E 3',
      name: 'DALL-E 3',
      provider: 'OpenAI',
      description:
        "OpenAI's advanced model with excellent prompt understanding and artistic interpretation. Creates highly detailed, stylized images with accurate subject placement and composition.",
      bestFor: ['Artistic styles', 'People, colors'],
      speed: 2,
      exampleImage:
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Flux Ultra',
      name: 'Flux Ultra',
      provider: 'Black Forest Labs',
      description:
        'Enhanced version of Flux Pro supporting ultra-high resolution up to 4 megapixels. Delivers maximum detail and photorealistic quality for professional production requirements.',
      bestFor: ['Realistic styles', 'Colors'],
      speed: 1,
      exampleImage:
        'https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Ideogram 2',
      name: 'Ideogram 2a',
      provider: 'Ideogram',
      description:
        'State-of-the-art text rendering with powerful inpainting capabilities. Excels at creating images with perfectly legible typography and complex textual elements.',
      bestFor: ['Realistic styles', 'Text'],
      speed: 2,
      exampleImage:
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&auto=format&fit=crop&q=80',
    },
    {
      key: 'Recraft',
      name: 'Recraft',
      provider: 'Recraft',
      description:
        'Specializes in generating SVG images including logotypes and icons. Supports a wide range of artistic styles with excellent versatility for creative and commercial applications.',
      bestFor: ['Artistic styles', 'Colors'],
      speed: 2,
      exampleImage:
        'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&auto=format&fit=crop&q=80',
    },
  ],
};

// Helper function to get the category of a model
export const getModelCategory = (modelKey: string): string => {
  if (aiModelOptions.basic.some(m => m.key === modelKey)) return 'basic';
  if (aiModelOptions.advanced.some(m => m.key === modelKey)) return 'advanced';
  if (aiModelOptions.premium.some(m => m.key === modelKey)) return 'premium';

  return 'basic'; // Default to basic if not found
};
