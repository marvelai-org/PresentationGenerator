/**
 * Represents an image source option
 */
export interface ImageSourceOption {
  /** Unique identifier for the image source */
  key: string;
  /** Display name of the image source */
  name: string;
  /** Description of the image source */
  description: string;
  /** Iconify icon name */
  icon: string;
  /** Whether this is a new feature */
  isNew?: boolean;
}

/**
 * Available image source options for presentation
 */
export const imageSourceOptions: ImageSourceOption[] = [
  {
    key: 'Automatic',
    name: 'Automatic',
    description: 'Automatically select best image type for each image',
    icon: 'material-symbols:auto-fix',
  },
  {
    key: 'AI images',
    name: 'AI images',
    description: 'Generate original images and graphics with AI',
    icon: 'material-symbols:auto-awesome',
  },
  {
    key: 'Stock photos',
    name: 'Stock photos',
    description: 'Search free high-resolution photos and backgrounds from Unsplash',
    icon: 'material-symbols:image',
  },
  {
    key: 'Web images',
    name: 'Web images',
    description: 'Search the internet for images',
    icon: 'material-symbols:public',
  },
  {
    key: 'Illustrations',
    name: 'Illustrations',
    description: 'Search for illustrations from Pictographic',
    icon: 'material-symbols:palette-outline',
  },
  {
    key: 'Animated GIFs',
    name: 'Animated GIFs',
    description: 'Search for fun animated GIFs from Giphy',
    icon: 'material-symbols:gif-box',
  },
  {
    key: 'Image placeholders',
    name: 'Image placeholders',
    description: 'Generate empty placeholders for your own images',
    icon: 'material-symbols:image-not-supported-outline',
    isNew: true,
  },
  {
    key: "Don't add images",
    name: "Don't add images",
    description: 'Create a presentation without images',
    icon: 'material-symbols:hide-image',
    isNew: true,
  },
];
