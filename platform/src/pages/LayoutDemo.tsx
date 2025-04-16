import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Divider,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { LayoutPanel } from '../components/features/layouts/LayoutPanel';
import { SlideElement } from '../types/slideTypes';
import { v4 as uuidv4 } from 'uuid';

// Generate some mock slide elements for the demo
const generateMockElements = (): SlideElement[] => {
  return [
    {
      id: uuidv4(),
      type: 'text',
      content: 'Slide Title',
      position: {
        x: '10%',
        y: '10%',
        width: '80%',
        height: '15%',
      },
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    },
    {
      id: uuidv4(),
      type: 'text',
      content: 'This is a paragraph of text that can be arranged using different layouts.',
      position: {
        x: '10%',
        y: '30%',
        width: '80%',
        height: '20%',
      },
      style: {
        fontSize: '16px',
        textAlign: 'left',
      },
    },
    {
      id: uuidv4(),
      type: 'image',
      content: 'https://via.placeholder.com/300x200?text=Sample+Image',
      position: {
        x: '25%',
        y: '55%',
        width: '50%',
        height: '30%',
      },
    },
    {
      id: uuidv4(),
      type: 'shape',
      content: 'rectangle',
      position: {
        x: '70%',
        y: '20%',
        width: '20%',
        height: '10%',
      },
      style: {
        backgroundColor: '#3182CE',
        borderRadius: '4px',
      },
    },
  ];
};

// Simple component to display elements in their positions
const ElementPreview: React.FC<{ element: SlideElement }> = ({ element }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      position="absolute"
      left={element.position.x}
      top={element.position.y}
      width={element.position.width}
      height={element.position.height}
      padding="8px"
      backgroundColor={element.style?.backgroundColor || bgColor}
      borderRadius={element.style?.borderRadius || '4px'}
      borderWidth="1px"
      borderColor={borderColor}
      display="flex"
      alignItems="center"
      justifyContent={
        element.style?.textAlign === 'center'
          ? 'center'
          : element.style?.textAlign === 'right'
          ? 'flex-end'
          : 'flex-start'
      }
    >
      {element.type === 'text' ? (
        <Text
          fontSize={element.style?.fontSize}
          fontWeight={element.style?.fontWeight}
          color={element.style?.color}
        >
          {element.content}
        </Text>
      ) : element.type === 'image' ? (
        <img src={element.content} alt="Element" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      ) : (
        <Box width="100%" height="100%" bg={element.style?.backgroundColor || 'blue.500'} />
      )}
    </Box>
  );
};

const LayoutDemo: React.FC = () => {
  const [elements, setElements] = useState<SlideElement[]>(generateMockElements());
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const slideBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleElementsUpdate = (updatedElements: SlideElement[]) => {
    setElements(updatedElements);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">
          Layout Panel Demo
        </Heading>
        <Text>
          This demo shows how the LayoutPanel component can be used to arrange slide elements with
          predefined layouts.
        </Text>
        <Divider />

        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          {/* Slide preview */}
          <Box flex="3" bg={bgColor} p={6} borderRadius="md">
            <VStack spacing={4} align="stretch">
              <Heading as="h2" size="md">
                Slide Preview
              </Heading>
              <Box
                position="relative"
                width="100%"
                height="500px"
                bg={slideBgColor}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                overflow="hidden"
              >
                {elements.map((element) => (
                  <ElementPreview key={element.id} element={element} />
                ))}
              </Box>
            </VStack>
          </Box>

          {/* Layout panel */}
          <Box flex="2" bg={bgColor} p={6} borderRadius="md">
            <LayoutPanel elements={elements} onElementsUpdate={handleElementsUpdate} />
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
};

export default LayoutDemo; 