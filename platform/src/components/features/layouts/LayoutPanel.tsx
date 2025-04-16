import React from 'react';
import { Box, Button, Divider, Heading, VStack, Text } from '@chakra-ui/react';
import { SlideElement } from '../../../types/slideTypes';
import { useLayoutIntegration } from '../../../hooks/useLayoutIntegration';
import { LayoutSelector } from './LayoutSelector';

interface LayoutPanelProps {
  elements: SlideElement[];
  onElementsUpdate: (elements: SlideElement[]) => void;
}

export const LayoutPanel: React.FC<LayoutPanelProps> = ({ elements, onElementsUpdate }) => {
  const {
    availableLayouts,
    selectedLayout,
    isLoading,
    selectLayout,
    applySelectedLayout,
  } = useLayoutIntegration({
    elements,
    onElementsUpdate,
  });

  return (
    <VStack spacing={4} align="stretch" width="100%" p={4}>
      <Heading size="md">Layout</Heading>
      <Text fontSize="sm" color="gray.600">
        Select a layout to organize your slide elements
      </Text>
      
      <Divider />
      
      {availableLayouts.length === 0 ? (
        <Box p={4} textAlign="center">
          <Text>No layouts available.</Text>
        </Box>
      ) : (
        <LayoutSelector
          layouts={availableLayouts}
          selectedLayout={selectedLayout}
          onSelectLayout={selectLayout}
        />
      )}
      
      <Button
        mt={4}
        colorScheme="blue"
        isDisabled={!selectedLayout || isLoading}
        isLoading={isLoading}
        onClick={applySelectedLayout}
        width="full"
      >
        Apply Layout
      </Button>
    </VStack>
  );
}; 