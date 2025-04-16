'use client';

import React, { useState, useRef } from 'react';
import { Button, Card, Input, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  showGenerateButton?: boolean;
  generateButtonText?: string;
  clearOnSubmit?: boolean;
  maxLength?: number;
  minLength?: number;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'What would you like to create?',
  className,
  showGenerateButton = true,
  generateButtonText = 'Generate Outline',
  clearOnSubmit = false,
  maxLength = 1000,
  minLength = 3,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim() || value.length < minLength) return;

    if (onSubmit) {
      onSubmit();
      if (clearOnSubmit) {
        onChange('');
      }
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Card
        className={cn(
          'bg-content1/10 border transition-all duration-300',
          isFocused ? 'border-primary/50 shadow-md' : 'border-content2'
        )}
      >
        <div className="flex items-center">
          <Input
            ref={inputRef}
            className="bg-transparent border-0 w-full"
            classNames={{
              inputWrapper: 'bg-transparent shadow-none border-0',
              input: 'py-4 px-4 text-medium',
            }}
            maxLength={maxLength}
            placeholder={placeholder}
            value={value}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            onValueChange={onChange}
          />

          {value.trim() && (
            <Tooltip content="Clear input">
              <Button
                isIconOnly
                className="mr-2 text-default-400"
                size="sm"
                variant="light"
                onPress={() => onChange('')}
              >
                <Icon icon="material-symbols:close" width={18} />
              </Button>
            </Tooltip>
          )}
        </div>
      </Card>

      {showGenerateButton && value.trim() && value.length >= minLength && (
        <div className="flex justify-center mt-6">
          <Button
            className="px-8"
            color="primary"
            size="lg"
            startContent={<Icon icon="material-symbols:magic-button" width={20} />}
            onPress={handleSubmit}
          >
            {generateButtonText}
          </Button>
        </div>
      )}

      {maxLength && (
        <div className="flex justify-end mt-1">
          <span
            className={cn(
              'text-xs',
              value.length > maxLength * 0.9 ? 'text-danger' : 'text-default-400'
            )}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}
