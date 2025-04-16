import React, { useState } from 'react';
import { Modal, ModalContent, Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

import ThemeGrid from './ThemeGrid';
import ThemePreviewPanel from './ThemePreviewPanel';

import { Theme } from '@/hooks/useTheme';

export interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: Theme[];
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
}

export default function ThemeSelectionModal({
  isOpen,
  onClose,
  themes,
  selectedTheme,
  onThemeSelect,
}: ThemeSelectionModalProps) {
  const [themeFilter, setThemeFilter] = useState<string>('all');

  return (
    <Modal
      hideCloseButton
      classNames={{
        backdrop: 'bg-[#00000099] backdrop-blur-sm',
        base: 'border-0 shadow-xl bg-[#1C1C1E]',
        header: 'border-b border-[#38383A]',
        body: 'p-0',
        footer: 'border-t border-[#38383A]',
        closeButton: 'hover:bg-white/5',
      }}
      isOpen={isOpen}
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        {onClose => (
          <div className="flex flex-col h-[85vh] apple-dark">
            <div className="flex justify-between items-center p-6 border-b border-[#38383A]">
              <div>
                <h2 className="text-xl font-bold text-white">All themes</h2>
                <p className="text-gray-400 text-sm">View and select from all themes</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  className="rounded-full text-gray-300 hover:bg-[#28282A]/50"
                  variant="light"
                  onPress={onClose}
                >
                  <Icon icon="material-symbols:close" width={20} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 h-full">
              {/* Left panel - Theme Browser */}
              <div className="col-span-2 border-r border-[#38383A] overflow-auto p-6 bg-[#1C1C1E]">
                <div className="mb-4">
                  <Input
                    className="mb-4 bg-[#232324] text-gray-300 border-[#38383A]"
                    placeholder="Search for a theme"
                    size="sm"
                    startContent={<Icon className="text-gray-400" icon="material-symbols:search" />}
                  />

                  <div className="flex gap-2 mb-6 overflow-x-auto">
                    <Button
                      className={
                        themeFilter === 'all'
                          ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                          : 'bg-[#232324] text-gray-300 border-[#38383A]'
                      }
                      radius="full"
                      size="sm"
                      variant={themeFilter === 'all' ? 'solid' : 'flat'}
                      onPress={() => setThemeFilter('all')}
                    >
                      All
                    </Button>
                    <Button
                      className={
                        themeFilter === 'dark'
                          ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                          : 'bg-[#232324] text-gray-300 border-[#38383A]'
                      }
                      radius="full"
                      size="sm"
                      variant={themeFilter === 'dark' ? 'solid' : 'flat'}
                      onPress={() => setThemeFilter('dark')}
                    >
                      Dark
                    </Button>
                    <Button
                      className={
                        themeFilter === 'light'
                          ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                          : 'bg-[#232324] text-gray-300 border-[#38383A]'
                      }
                      radius="full"
                      size="sm"
                      variant={themeFilter === 'light' ? 'solid' : 'flat'}
                      onPress={() => setThemeFilter('light')}
                    >
                      Light
                    </Button>
                    <Button
                      className={
                        themeFilter === 'professional'
                          ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                          : 'bg-[#232324] text-gray-300 border-[#38383A]'
                      }
                      radius="full"
                      size="sm"
                      variant={themeFilter === 'professional' ? 'solid' : 'flat'}
                      onPress={() => setThemeFilter('professional')}
                    >
                      Professional
                    </Button>
                    <Button
                      className={
                        themeFilter === 'colorful'
                          ? 'bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white'
                          : 'bg-[#232324] text-gray-300 border-[#38383A]'
                      }
                      radius="full"
                      size="sm"
                      variant={themeFilter === 'colorful' ? 'solid' : 'flat'}
                      onPress={() => setThemeFilter('colorful')}
                    >
                      Colorful
                    </Button>
                  </div>
                </div>

                <ThemeGrid
                  selectedTheme={selectedTheme}
                  themeFilter={themeFilter}
                  themes={themes}
                  onThemeSelect={onThemeSelect}
                />
              </div>

              {/* Right panel - Theme Preview */}
              <ThemePreviewPanel selectedTheme={selectedTheme} />
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
