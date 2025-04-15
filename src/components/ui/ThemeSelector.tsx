'use client';

import React from 'react';
import { Card, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';

export interface Theme {
  id: string | number;
  name: string;
  backgroundColor: string;
  textColor?: string;
  accentColor?: string;
  titleFont?: string;
  bodyFont?: string;
  preview?: React.ReactNode;
}

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  viewMoreLink?: string;
}

export default function ThemeSelector({
  themes,
  selectedTheme,
  onSelectTheme,
  viewMoreLink,
}: ThemeSelectorProps) {
  return (
    <div className="w-full apple-dark">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-white">Themes</h3>
        {viewMoreLink && (
          <Button
            as="a"
            className="text-gray-300"
            href={viewMoreLink}
            size="sm"
            startContent={<Icon className="text-gray-300" icon="material-symbols:visibility" />}
            variant="light"
          >
            View more
          </Button>
        )}
      </div>

      {/* Test button to verify purple primary color */}
      <Button className="mb-4" color="primary" variant="solid">
        This button should be purple (#7828C8)
      </Button>

      <p className="text-gray-400 text-sm mb-4">Use one of our popular themes below or view more</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {themes.map(theme => (
          <Card
            key={theme.id}
            isPressable
            className={cn(
              'p-0 overflow-hidden border transition-all hover:scale-[1.01] hover:shadow-md',
              selectedTheme.id === theme.id
                ? 'border-2 border-gray-400 shadow-md'
                : 'border-[#38383A]'
            )}
            style={{ backgroundColor: '#232324' }}
            onPress={() => onSelectTheme(theme)}
          >
            {/* Custom Theme Preview */}
            {theme.preview ? (
              theme.preview
            ) : (
              <div
                className="p-3 rounded-lg mb-0"
                style={{
                  backgroundColor: theme.backgroundColor,
                  color: theme.textColor || 'inherit',
                }}
              >
                <p
                  className="font-semibold"
                  style={{
                    fontFamily: theme.titleFont,
                    color: theme.textColor,
                  }}
                >
                  Title
                </p>
                <div
                  className="text-sm"
                  style={{
                    fontFamily: theme.bodyFont,
                  }}
                >
                  Body & <span style={{ color: theme.accentColor || '#C0C0C0' }}>link</span>
                </div>
              </div>
            )}

            <div className="text-center text-sm p-2">{theme.name}</div>

            {selectedTheme.id === theme.id && (
              <div className="absolute top-2 left-2 text-gray-400">
                <Icon icon="material-symbols:check" />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
