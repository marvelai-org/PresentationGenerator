import React from 'react';
import { LayoutGenerator } from '../../../lib/layout/LayoutGenerator';
import { SlideElement } from '../../../types/slideTypes';

interface LayoutApplierProps {
  layoutKey: string;
  elements: SlideElement[];
  canvasWidth: number;
  canvasHeight: number;
  onLayoutApplied: (updatedElements: SlideElement[]) => void;
}

export const LayoutApplier: React.FC<LayoutApplierProps> = ({
  layoutKey,
  elements,
  canvasWidth,
  canvasHeight,
  onLayoutApplied
}) => {
  const applyLayout = () => {
    const layoutGenerator = new LayoutGenerator();
    
    try {
      // Generate layout based on the selected preset
      const generatedLayout = layoutGenerator.generateLayout(
        layoutKey,
        canvasWidth,
        canvasHeight
      );
      
      // Map the layout to the elements
      const updatedElements = mapLayoutToElements(elements, generatedLayout.elements);
      
      // Call the callback with the updated elements
      onLayoutApplied(updatedElements);
    } catch (error) {
      console.error('Failed to apply layout:', error);
    }
  };
  
  // Maps layout positions to slide elements
  const mapLayoutToElements = (
    sourceElements: SlideElement[],
    layoutElements: { id: string; x: number; y: number; width: number; height: number }[]
  ): SlideElement[] => {
    // If we have fewer layout positions than elements, we can't apply the layout
    if (layoutElements.length < sourceElements.length) {
      console.warn('Not enough layout positions for all elements');
      return sourceElements;
    }
    
    // Create a new array with updated positions
    return sourceElements.map((element, index) => {
      if (index < layoutElements.length) {
        const layoutElement = layoutElements[index];
        
        return {
          ...element,
          position: {
            x: layoutElement.x,
            y: layoutElement.y
          },
          size: {
            width: layoutElement.width,
            height: layoutElement.height
          }
        };
      }
      
      // For any elements beyond the layout's capacity, keep them as is
      return element;
    });
  };
  
  return (
    <button
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={applyLayout}
    >
      Apply Layout
    </button>
  );
}; 