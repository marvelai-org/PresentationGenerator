import { ReactNode } from 'react';
import { TemplateType } from '@/types/editor';

// Template component props interface
export interface TemplateProps {
  data?: Record<string, any>;
  onContentChange?: (slotId: string, content: any) => void;
  editable?: boolean;
  className?: string;
}

// Template registration interface
export interface TemplateRegistration {
  type: TemplateType;
  name: string;
  description: string;
  component: React.ComponentType<TemplateProps>;
  thumbnail?: string;
  defaultData: Record<string, any>;
  slots: TemplateSlot[];
  category?: string;
}

// Template slot definition
export interface TemplateSlot {
  id: string;
  name: string;
  type: 'text' | 'image' | 'chart' | 'video' | 'shape' | 'list';
  required: boolean;
  position: { x: number, y: number, width: number, height: number };
  defaultContent?: any;
  adaptiveRules?: AdaptiveRules;
}

// Adaptive rules for content fitting
export interface AdaptiveRules {
  minFontSize?: number;
  maxFontSize?: number;
  autoScale?: boolean;
  overflowBehavior?: 'truncate' | 'scroll' | 'expand' | 'shrink';
  responsivePositions?: Record<string, { x: number, y: number, width: number, height: number }>;
}

// Global template registry
class TemplateRegistry {
  private templates: Map<TemplateType, TemplateRegistration> = new Map();
  
  register(template: TemplateRegistration): void {
    this.templates.set(template.type, template);
  }
  
  getTemplate(type: TemplateType): TemplateRegistration | undefined {
    return this.templates.get(type);
  }
  
  getAllTemplates(): TemplateRegistration[] {
    return Array.from(this.templates.values());
  }
  
  getTemplatesByCategory(category: string): TemplateRegistration[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }
}

export const templateRegistry = new TemplateRegistry();

// Re-export for easy access
export default templateRegistry; 