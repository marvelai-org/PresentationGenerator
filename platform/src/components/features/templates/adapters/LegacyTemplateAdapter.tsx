import React from 'react';
import { SlideLayout, SlideElement } from '@/store/slices/slides';
import { TemplateProps, TemplateSlot } from '../TemplateRegistry';
import ContentSlot from '../slots/ContentSlot';

interface LegacyTemplateAdapterProps extends TemplateProps {
  layoutType: SlideLayout;
  elements?: Partial<SlideElement>[];
}

/**
 * Adapter component that converts existing slide layouts to use the new template system
 * This allows for a gradual migration of existing templates
 */
const LegacyTemplateAdapter: React.FC<LegacyTemplateAdapterProps> = ({
  layoutType,
  elements,
  data = {},
  onContentChange,
  editable = false,
  className = ''
}) => {
  // Use provided elements or try to get them from the store
  const slideElements = elements || [];
  
  // Convert element types to ContentSlot types
  const getSlotType = (elementType: string): 'text' | 'image' | 'shape' | 'chart' | 'video' | 'list' => {
    switch (elementType) {
      case 'text': return 'text';
      case 'image': return 'image';
      case 'shape': return 'shape';
      case 'chart': return 'chart';
      case 'video': return 'video';
      case 'code': return 'text'; // Map code to text for now
      default: return 'text';
    }
  };
  
  return (
    <div className={`relative w-full h-full ${className}`}
      style={{
        background: data.background?.value || '#ffffff',
        color: data.textColor || '#000000'
      }}>
      {slideElements.map((element, index) => {
        const elementId = `legacy-${layoutType}-${index}`;
        const slotType = getSlotType(element.type || 'text');
        
        // Map legacy content to the new system
        const content = data[elementId] || element.content || '';
        
        return (
          <ContentSlot
            key={elementId}
            id={elementId}
            type={slotType}
            content={content}
            position={{
              x: element.x || 0,
              y: element.y || 0,
              width: element.width || 100,
              height: element.height || 100
            }}
            style={element.style || {}}
            editable={editable}
            onChange={content => onContentChange?.(elementId, content)}
            adaptiveRules={{
              minFontSize: 12,
              maxFontSize: slotType === 'text' ? 56 : undefined,
              autoScale: true,
              overflowBehavior: 'shrink',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Utility function to convert legacy slide layouts to template slots
 */
export const convertLegacyLayoutToSlots = (
  layoutType: SlideLayout,
  elements: Partial<SlideElement>[]
): TemplateSlot[] => {
  return elements.map((element, index) => {
    const elementId = `legacy-${layoutType}-${index}`;
    const slotType = element.type === 'image' ? 'image' : 
                     element.type === 'shape' ? 'shape' : 
                     element.type === 'chart' ? 'chart' : 
                     element.type === 'video' ? 'video' : 'text';
                     
    return {
      id: elementId,
      name: `${slotType.charAt(0).toUpperCase() + slotType.slice(1)} ${index + 1}`,
      type: slotType as any,
      required: index === 0, // Assume first element is required
      position: {
        x: element.x || 0,
        y: element.y || 0,
        width: element.width || 100,
        height: element.height || 100
      },
      defaultContent: element.content || '',
      adaptiveRules: {
        minFontSize: 12,
        maxFontSize: slotType === 'text' ? 56 : undefined,
        autoScale: true,
        overflowBehavior: 'shrink',
      }
    };
  });
};

export default LegacyTemplateAdapter; 