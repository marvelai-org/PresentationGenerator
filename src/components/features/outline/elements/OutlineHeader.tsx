import * as React from 'react';
import {
  Button,
  Card,
  Input,
  Tooltip,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface OutlineHeaderProps {
  /**
   * Current prompt/topic text
   */
  prompt: string;

  /**
   * Handler for prompt changes
   */
  onPromptChange: (value: string) => void;

  /**
   * Handler for prompt focus
   */
  onPromptFocus?: () => void;

  /**
   * Handler for refreshing/regenerating outline
   */
  onRefresh: () => void;

  /**
   * Whether the outline is currently loading
   */
  isLoading: boolean;

  /**
   * Whether editing the prompt
   */
  isEditingPrompt: boolean;

  /**
   * Handler for canceling prompt edit
   */
  onCancelEdit: () => void;

  /**
   * Current selected style
   */
  style: string;

  /**
   * Handler for style changes
   */
  onStyleChange: (style: string) => void;

  /**
   * Available style options
   */
  styleOptions: string[];

  /**
   * Current selected language
   */
  language: string;

  /**
   * Handler for language changes
   */
  onLanguageChange: (language: string) => void;

  /**
   * Available language options
   */
  languageOptions: string[];
}

/**
 * Header component for the outline page with prompt and settings
 */
export function OutlineHeader({
  prompt,
  onPromptChange,
  onPromptFocus,
  onRefresh,
  isLoading,
  isEditingPrompt,
  onCancelEdit,
  style,
  onStyleChange,
  styleOptions,
  language,
  onLanguageChange,
  languageOptions,
}: OutlineHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6 mt-4">
      {/* Options row */}
      <div className="flex flex-wrap gap-2 w-full justify-center mb-4">
        {/* Style Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-[#1C1C1E] border-[#38383A] text-gray-300"
              endContent={
                <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-down" />
              }
              variant="flat"
            >
              {style}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Style Options"
            selectedKeys={[style]}
            selectionMode="single"
            onAction={key => onStyleChange(key as string)}
          >
            {styleOptions.map(styleOption => (
              <DropdownItem key={styleOption}>{styleOption}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Language Dropdown */}
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-[#1C1C1E] border-[#38383A] text-gray-300"
              endContent={
                <Icon className="text-gray-400" icon="material-symbols:keyboard-arrow-down" />
              }
              variant="flat"
            >
              {language}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Language Options"
            selectedKeys={[language]}
            selectionMode="single"
            onAction={key => onLanguageChange(key as string)}
          >
            {languageOptions.map(langOption => (
              <DropdownItem key={langOption}>{langOption}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Prompt Input */}
      <div className="w-full mb-6">
        <Card className="p-1 bg-[#1C1C1E] border-1 border-[#38383A]">
          <Input
            classNames={{
              base: 'w-full',
              input: 'text-lg py-2 min-h-[50px] text-gray-300',
            }}
            endContent={
              <Tooltip content="Regenerate outline" placement="bottom">
                <Button
                  isIconOnly
                  className="text-gray-300"
                  isDisabled={isLoading}
                  variant="light"
                  onPress={() => {
                    if (prompt.trim()) {
                      onRefresh();
                    }
                  }}
                >
                  {isLoading ? (
                    <Spinner color="default" size="sm" />
                  ) : (
                    <Icon icon="material-symbols:refresh" width={20} />
                  )}
                </Button>
              </Tooltip>
            }
            size="lg"
            value={prompt}
            variant="flat"
            onChange={e => onPromptChange(e.target.value)}
            onFocus={onPromptFocus}
          />
        </Card>
      </div>

      {/* Generate/Cancel buttons - only show when editing prompt */}
      {isEditingPrompt && (
        <div className="flex justify-center gap-4 mt-2">
          <Button
            className="bg-[#1C1C1E] border-1 border-[#38383A] px-8 text-gray-300"
            variant="flat"
            onPress={onCancelEdit}
          >
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] px-8 text-white border-1 border-[#38383A]"
            isDisabled={isLoading || !prompt.trim()}
            onPress={onRefresh}
          >
            Generate outline
          </Button>
        </div>
      )}
    </div>
  );
}
