import { useState, useCallback } from 'react';
import { SlideElement } from '../types/slideTypes';
import { LayoutOption } from '../components/features/layouts/LayoutSelector';

// Mock layout options - in a real app these would likely come from an API or config
const layouts: LayoutOption[] = [
  {
    key: 'grid-2x2',
    name: 'Grid 2x2',
    description: 'Arrange elements in a 2x2 grid',
    thumbnail: '/layouts/grid-2x2.png',
  },
  {
    key: 'horizontal-thirds',
    name: 'Horizontal Thirds',
    description: 'Split slide into three horizontal sections',
    thumbnail: '/layouts/horizontal-thirds.png',
  },
  {
    key: 'vertical-split',
    name: 'Vertical Split',
    description: 'Split slide into two vertical sections',
    thumbnail: '/layouts/vertical-split.png',
  },
  {
    key: 'title-content',
    name: 'Title & Content',
    description: 'Traditional title with content below',
    thumbnail: '/layouts/title-content.png',
  },
];

interface UseLayoutIntegrationProps {
  elements: SlideElement[];
  onElementsUpdate: (elements: SlideElement[]) => void;
}

interface UseLayoutIntegrationReturn {
  availableLayouts: LayoutOption[];
  selectedLayout: string | null;
  isLoading: boolean;
  selectLayout: (layoutKey: string) => void;
  applySelectedLayout: () => void;
}

export const useLayoutIntegration = ({
  elements,
  onElementsUpdate,
}: UseLayoutIntegrationProps): UseLayoutIntegrationReturn => {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectLayout = useCallback((layoutKey: string) => {
    setSelectedLayout(layoutKey);
  }, []);

  const applySelectedLayout = useCallback(() => {
    if (!selectedLayout) return;

    setIsLoading(true);

    // Simulate API call or complex layout calculation
    setTimeout(() => {
      // Apply the selected layout to the elements
      // This is a simplified example - in a real app, you would have more complex positioning logic
      const updatedElements = applyLayoutToElements(elements, selectedLayout);
      
      onElementsUpdate(updatedElements);
      setIsLoading(false);
    }, 500); // Simulate processing delay
  }, [selectedLayout, elements, onElementsUpdate]);

  return {
    availableLayouts: layouts,
    selectedLayout,
    isLoading,
    selectLayout,
    applySelectedLayout,
  };
};

// Helper function to apply layout to elements
function applyLayoutToElements(elements: SlideElement[], layoutKey: string): SlideElement[] {
  const updatedElements = [...elements];

  // Simple positioning logic based on layout type
  switch (layoutKey) {
    case 'grid-2x2': {
      const positions = [
        { x: 0, y: 0, width: 50, height: 50 },
        { x: 50, y: 0, width: 50, height: 50 },
        { x: 0, y: 50, width: 50, height: 50 },
        { x: 50, y: 50, width: 50, height: 50 },
      ];
      
      return positionElements(updatedElements, positions);
    }
    case 'horizontal-thirds': {
      const positions = [
        { x: 0, y: 0, width: 100, height: 33 },
        { x: 0, y: 33, width: 100, height: 33 },
        { x: 0, y: 66, width: 100, height: 34 },
      ];
      
      return positionElements(updatedElements, positions);
    }
    case 'vertical-split': {
      const positions = [
        { x: 0, y: 0, width: 50, height: 100 },
        { x: 50, y: 0, width: 50, height: 100 },
      ];
      
      return positionElements(updatedElements, positions);
    }
    case 'title-content': {
      const positions = [
        { x: 0, y: 0, width: 100, height: 20 }, // Title
        { x: 0, y: 20, width: 100, height: 80 }, // Content
      ];
      
      return positionElements(updatedElements, positions);
    }
    default:
      return updatedElements;
  }
}

// Helper function to position elements according to a layout
function positionElements(
  elements: SlideElement[],
  positions: Array<{ x: number; y: number; width: number; height: number }>
): SlideElement[] {
  return elements.map((element, index) => {
    if (index < positions.length) {
      const pos = positions[index];
      return {
        ...element,
        position: {
          x: `${pos.x}%`,
          y: `${pos.y}%`,
          width: `${pos.width}%`,
          height: `${pos.height}%`,
        },
      };
    }
    return element;
  });
} 