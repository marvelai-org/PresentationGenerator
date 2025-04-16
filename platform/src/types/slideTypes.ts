export interface ElementPosition {
  x: string;
  y: string;
  width: string;
  height: string;
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart';
  content: string;
  position: ElementPosition;
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: string;
    opacity?: number;
    [key: string]: any;
  };
}

export interface Slide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
  };
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
  theme?: string;
} 