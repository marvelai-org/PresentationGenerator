import React from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

export interface LayoutOption {
  key: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface LayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: string | null;
  onSelectLayout: (layoutKey: string) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  layouts,
  selectedLayout,
  onSelectLayout,
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={4}>
      {layouts.map((layout) => (
        <Box
          key={layout.key}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={selectedLayout === layout.key ? selectedBorderColor : borderColor}
          bg={selectedLayout === layout.key ? selectedBg : 'transparent'}
          cursor="pointer"
          onClick={() => onSelectLayout(layout.key)}
          transition="all 0.2s"
          _hover={{ bg: hoverBg }}
          p={3}
        >
          <VStack spacing={2} align="start">
            <Box position="relative" width="100%" height="100px" overflow="hidden">
              <Image
                src={layout.thumbnail}
                alt={layout.name}
                fallbackSrc="https://via.placeholder.com/150?text=Layout"
                objectFit="contain"
                width="100%"
                height="100%"
              />
            </Box>
            <Text fontWeight="bold" fontSize="sm">
              {layout.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {layout.description}
            </Text>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}; 