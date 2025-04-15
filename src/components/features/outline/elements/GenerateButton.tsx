import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface GenerateButtonProps {
  /**
   * Callback function when button is clicked
   */
  onClick: () => void;

  /**
   * Whether the button is in a loading state
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled
   */
  isDisabled?: boolean;

  /**
   * Text to display on the button
   */
  text?: string;
}

/**
 * Primary action button for generating presentations
 */
export function GenerateButton({
  onClick,
  isLoading = false,
  isDisabled = false,
  text = 'Generate',
}: GenerateButtonProps) {
  return (
    <Button
      color="primary"
      isDisabled={isLoading || isDisabled}
      isLoading={isLoading}
      size="lg"
      startContent={<Icon icon="material-symbols:magic-button" />}
      onPress={onClick}
    >
      {text}
    </Button>
  );
}
