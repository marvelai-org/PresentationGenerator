import React from 'react';
import {
  Button,
  RadioGroup,
  Radio,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { Theme } from '../types/theme';

interface CustomizationPanelProps {
  /**
   * Current selected theme
   */
  selectedTheme: Theme;

  /**
   * Handler for theme changes
   */
  onThemeSelect: (theme: Theme) => void;

  /**
   * Current text density setting
   */
  textDensity: string;

  /**
   * Handler for text density changes
   */
  onTextDensityChange: (density: string) => void;

  /**
   * Current image source setting
   */
  imageSource: string;

  /**
   * Handler for image source changes
   */
  onImageSourceChange: (source: string) => void;

  /**
   * Handler for opening the theme selection modal
   */
  onOpenThemeModal: () => void;

  /**
   * Handler for opening the image source modal
   */
  onOpenImageSourceModal: () => void;
}

/**
 * Panel for customizing presentation settings like theme, text density, and images
 */
export function CustomizationPanel({
  selectedTheme,
  onThemeSelect,
  textDensity,
  onTextDensityChange,
  imageSource,
  onImageSourceChange,
  onOpenThemeModal,
  onOpenImageSourceModal,
}: CustomizationPanelProps) {
  return (
    <div className="bg-[#1C1C1E] border border-[#38383A] rounded-xl p-4 mb-4">
      <h3 className="text-white text-lg font-semibold mb-4">Customize</h3>

      {/* Theme Selection */}
      <div className="mb-4">
        <div className="text-sm text-gray-300 mb-2">Theme</div>
        <Button
          fullWidth
          className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
          endContent={
            <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-right" />
          }
          variant="flat"
          onPress={onOpenThemeModal}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: selectedTheme.isDark
                  ? selectedTheme.linkColor
                  : selectedTheme.titleColor,
              }}
            />
            {selectedTheme.name}
          </div>
        </Button>
      </div>

      {/* Text Density */}
      <div className="mb-4">
        <div className="text-sm text-gray-300 mb-2">Text Density</div>
        <RadioGroup
          orientation="horizontal"
          value={textDensity}
          onValueChange={onTextDensityChange}
        >
          <Radio className="text-gray-300" value="concise">
            Concise
          </Radio>
          <Radio className="text-gray-300" value="balanced">
            Balanced
          </Radio>
          <Radio className="text-gray-300" value="detailed">
            Detailed
          </Radio>
        </RadioGroup>
      </div>

      {/* Image Source */}
      <div>
        <div className="text-sm text-gray-300 mb-2">Images</div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              fullWidth
              className="justify-between bg-[#232324] text-gray-300 border-[#38383A]"
              endContent={
                <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-down" />
              }
              startContent={<Icon className="text-gray-400" icon="material-symbols:image" />}
              variant="flat"
              onPress={onOpenImageSourceModal}
            >
              {imageSource}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Image Source Options"
            onAction={key => onImageSourceChange(key as string)}
          >
            <DropdownItem key="None" startContent={<Icon icon="material-symbols:no-photography" />}>
              None
            </DropdownItem>
            <DropdownItem key="Dall-E" startContent={<Icon icon="simple-icons:openai" />}>
              Dall-E
            </DropdownItem>
            <DropdownItem key="Unsplash" startContent={<Icon icon="simple-icons:unsplash" />}>
              Unsplash
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
