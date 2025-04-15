'use client';

import { useState } from 'react';
import { Button, Tabs, Tab, Card, CardBody, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';

interface SlideStylesProps {
  isOpen: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
}

export default function SlideStyles({ isOpen, onSelect, onClose }: SlideStylesProps) {
  const [activeTab, setActiveTab] = useState('layouts');

  const layouts = [
    { id: 'title', name: 'Title', icon: 'material-symbols:title' },
    { id: 'content', name: 'Content', icon: 'material-symbols:list-alt' },
    { id: 'media', name: 'Media', icon: 'material-symbols:image' },
    { id: 'quote', name: 'Quote', icon: 'material-symbols:format-quote' },
    { id: 'comparison', name: 'Comparison', icon: 'material-symbols:compare' },
    { id: 'team', name: 'Team', icon: 'material-symbols:people' },
    { id: 'stats', name: 'Stats', icon: 'material-symbols:monitoring' },
    { id: 'timeline', name: 'Timeline', icon: 'material-symbols:timeline' },
  ];

  const colors = [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'darkGray', name: 'Dark Gray', color: '#222222' },
    { id: 'gray', name: 'Gray', color: '#666666' },
    { id: 'lightGray', name: 'Light Gray', color: '#999999' },
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'blue', name: 'Blue', color: '#1a73e8' },
    { id: 'green', name: 'Green', color: '#34a853' },
    { id: 'purple', name: 'Purple', color: '#a142f4' },
    { id: 'pink', name: 'Pink', color: '#f439a0' },
    { id: 'red', name: 'Red', color: '#ea4335' },
    { id: 'orange', name: 'Orange', color: '#fa7b17' },
    { id: 'yellow', name: 'Yellow', color: '#fbbc04' },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center p-6">
      <div className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Slide Style</h3>
          <Button isIconOnly className="text-gray-400" size="sm" variant="light" onPress={onClose}>
            <Icon icon="material-symbols:close" width={20} />
          </Button>
        </div>

        <div className="flex-1 flex">
          <Tabs
            aria-label="Slide Style Options"
            classNames={{
              tabList: 'bg-black w-48 p-2 border-r border-gray-800',
              cursor: 'bg-indigo-500',
              tab: 'text-gray-400 data-[selected=true]:text-white py-3 px-4',
            }}
            selectedKey={activeTab}
            onSelectionChange={setActiveTab as any}
          >
            <Tab
              key="layouts"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:dashboard" width={20} />
                  <span>Layouts</span>
                </div>
              }
            />
            <Tab
              key="templates"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:auto-awesome" width={20} />
                  <span>Templates</span>
                </div>
              }
            />
            <Tab
              key="themes"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:palette" width={20} />
                  <span>Themes</span>
                </div>
              }
            />
            <Tab
              key="colors"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:format-color-fill" width={20} />
                  <span>Colors</span>
                </div>
              }
            />
            <Tab
              key="backgrounds"
              title={
                <div className="flex items-center gap-2">
                  <Icon icon="material-symbols:image" width={20} />
                  <span>Backgrounds</span>
                </div>
              }
            />
          </Tabs>

          <div className="flex-1 p-6 overflow-auto">
            <ScrollShadow className="h-full">
              {activeTab === 'layouts' && (
                <div>
                  <h4 className="text-white text-lg mb-4">Choose a layout</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {layouts.map(layout => (
                      <Card
                        key={layout.id}
                        className="bg-gray-800 hover:bg-gray-700 cursor-pointer border-gray-700 hover:border-indigo-500 transition-all"
                      >
                        <CardBody className="p-4 flex flex-col items-center justify-center h-32">
                          <Icon className="text-white mb-2" icon={layout.icon} width={32} />
                          <div className="text-white text-sm">{layout.name}</div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'colors' && (
                <div>
                  <h4 className="text-white text-lg mb-4">Choose a color</h4>
                  <div className="grid grid-cols-6 gap-4">
                    {colors.map(color => (
                      <div
                        key={color.id}
                        aria-label={`Select ${color.name} color`}
                        className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all"
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect(color.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onSelect(color.id);
                          }
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full mb-2 ring-1 ring-gray-700"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-white text-xs">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'templates' && (
                <div>
                  <h4 className="text-white text-lg mb-4">Choose a template</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 cursor-pointer hover:border-indigo-500 transition-all">
                      <div className="h-40 bg-[#1a0e2e] rounded mb-2 flex items-center justify-center">
                        <span className="text-white text-xl">Minimal Dark</span>
                      </div>
                      <div className="text-white text-sm">Minimal Dark</div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 cursor-pointer hover:border-indigo-500 transition-all">
                      <div className="h-40 bg-[#102040] rounded mb-2 flex items-center justify-center">
                        <span className="text-white text-xl">Corporate Blue</span>
                      </div>
                      <div className="text-white text-sm">Corporate Blue</div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 cursor-pointer hover:border-indigo-500 transition-all">
                      <div className="h-40 bg-[#401020] rounded mb-2 flex items-center justify-center">
                        <span className="text-white text-xl">Creative Red</span>
                      </div>
                      <div className="text-white text-sm">Creative Red</div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 cursor-pointer hover:border-indigo-500 transition-all">
                      <div className="h-40 bg-[#202040] rounded mb-2 flex items-center justify-center">
                        <span className="text-white text-xl">Deep Blue</span>
                      </div>
                      <div className="text-white text-sm">Deep Blue</div>
                    </div>
                    <div className="border border-gray-700 rounded-lg p-2 bg-gray-800 cursor-pointer hover:border-indigo-500 transition-all">
                      <div className="h-40 bg-[#204020] rounded mb-2 flex items-center justify-center">
                        <span className="text-white text-xl">Forest Green</span>
                      </div>
                      <div className="text-white text-sm">Forest Green</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'backgrounds' && (
                <div>
                  <h4 className="text-white text-lg mb-4">Choose a background</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="cursor-pointer hover:scale-105 transition-all">
                      <div className="h-32 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mb-2" />
                      <div className="text-white text-sm">Purple Pink</div>
                    </div>
                    <div className="cursor-pointer hover:scale-105 transition-all">
                      <div className="h-32 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 mb-2" />
                      <div className="text-white text-sm">Blue Teal</div>
                    </div>
                    <div className="cursor-pointer hover:scale-105 transition-all">
                      <div className="h-32 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 mb-2" />
                      <div className="text-white text-sm">Orange Yellow</div>
                    </div>
                    <div className="cursor-pointer hover:scale-105 transition-all">
                      <div
                        className="h-32 rounded-lg mb-2"
                        style={{
                          background: 'url("/climate-earth.jpg")',
                          backgroundSize: 'cover',
                        }}
                      />
                      <div className="text-white text-sm">Earth</div>
                    </div>
                    <div className="cursor-pointer hover:scale-105 transition-all">
                      <div className="h-32 rounded-lg bg-black mb-2" />
                      <div className="text-white text-sm">Black</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'themes' && (
                <div>
                  <h4 className="text-white text-lg mb-4">Choose a theme</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <Card className="bg-gray-800 hover:bg-gray-700 cursor-pointer border-gray-700 hover:border-indigo-500 transition-all">
                      <CardBody className="p-4">
                        <div className="h-24 bg-black rounded-md mb-2 flex items-center justify-center">
                          <span className="text-white">Night</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-white text-sm">Night</span>
                          <div className="flex">
                            <div className="w-4 h-4 rounded-full bg-white" />
                            <div className="w-4 h-4 rounded-full bg-gray-500 -ml-1" />
                            <div className="w-4 h-4 rounded-full bg-indigo-500 -ml-1" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gray-800 hover:bg-gray-700 cursor-pointer border-gray-700 hover:border-indigo-500 transition-all">
                      <CardBody className="p-4">
                        <div className="h-24 bg-white rounded-md mb-2 flex items-center justify-center">
                          <span className="text-black">Day</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-white text-sm">Day</span>
                          <div className="flex">
                            <div className="w-4 h-4 rounded-full bg-black" />
                            <div className="w-4 h-4 rounded-full bg-gray-800 -ml-1" />
                            <div className="w-4 h-4 rounded-full bg-blue-500 -ml-1" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="bg-gray-800 hover:bg-gray-700 cursor-pointer border-gray-700 hover:border-indigo-500 transition-all">
                      <CardBody className="p-4">
                        <div className="h-24 bg-indigo-900 rounded-md mb-2 flex items-center justify-center">
                          <span className="text-white">Vibrant</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-white text-sm">Vibrant</span>
                          <div className="flex">
                            <div className="w-4 h-4 rounded-full bg-pink-500" />
                            <div className="w-4 h-4 rounded-full bg-indigo-500 -ml-1" />
                            <div className="w-4 h-4 rounded-full bg-teal-500 -ml-1" />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )}
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  );
}
