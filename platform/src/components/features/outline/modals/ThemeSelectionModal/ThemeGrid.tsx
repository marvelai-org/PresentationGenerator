import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

import { Theme } from '@/hooks/useTheme';

interface ThemeGridProps {
  themes: Theme[];
  selectedTheme: Theme;
  themeFilter: string;
  onThemeSelect: (theme: Theme) => void;
}

export default function ThemeGrid({
  themes,
  selectedTheme,
  themeFilter,
  onThemeSelect,
}: ThemeGridProps) {
  const filteredThemes = themes.filter(theme => {
    if (themeFilter === 'all') return true;
    if (themeFilter === 'dark') return theme.isDark;
    if (themeFilter === 'light') return !theme.isDark;

    // Additional filters could be implemented here
    return true;
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      {filteredThemes.map(theme => (
        <Card
          key={theme.id}
          isPressable
          className={`p-0 overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
            selectedTheme.id === theme.id
              ? 'ring-1 ring-white/30 shadow-md'
              : 'border border-[#38383A]/50'
          }`}
          shadow="none"
          style={{ backgroundColor: '#232324' }}
          onPress={() => onThemeSelect(theme)}
        >
          <div className="flex flex-col h-full">
            <div
              className="p-4 relative"
              style={{
                backgroundColor: '#2C2C2E',
                color: '#F2F2F2',
              }}
            >
              <div
                className="w-full h-1 absolute top-0 left-0 right-0"
                style={{ backgroundColor: theme.isDark ? theme.linkColor : theme.titleColor }}
              />
              <div className="font-semibold text-white">Title</div>
              <div className="text-xs text-white opacity-80">
                Body & <span style={{ color: theme.linkColor }}>link</span>
              </div>
            </div>
            <div className="relative text-center text-xs py-2 px-1 bg-[#28282A] text-white/90">
              {selectedTheme.id === theme.id && (
                <Icon
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 text-white/80"
                  icon="material-symbols:check"
                  width={14}
                />
              )}
              <span className={selectedTheme.id === theme.id ? 'ml-3' : ''}>{theme.name}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
