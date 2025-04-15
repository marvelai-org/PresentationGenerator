import React from 'react';

import { Theme } from '../types/theme';

interface ThemePreviewProps {
  /**
   * Theme to preview
   */
  theme: Theme;

  /**
   * Optional custom content for preview
   */
  customContent?: React.ReactNode;
}

/**
 * Component to preview how a theme looks
 */
export function ThemePreview({ theme, customContent }: ThemePreviewProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.bodyColor,
      }}
    >
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {customContent ? (
            customContent
          ) : (
            <>
              <div className="mb-2 text-sm opacity-70">Hello 👋</div>

              <h1 className="text-4xl font-bold mb-6" style={{ color: theme.titleColor }}>
                This is a theme preview
              </h1>

              <div className="space-y-4 mb-8">
                <p>
                  This is body text. You can change your fonts, colors and images later in the theme
                  editor. You can also create your own custom branded theme.
                </p>

                <p>
                  <a href="#" style={{ color: theme.linkColor }}>
                    This is a link
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <p>This is a smart layout: it acts as a text box.</p>
                </div>
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <p>You can get these by typing /smart</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
