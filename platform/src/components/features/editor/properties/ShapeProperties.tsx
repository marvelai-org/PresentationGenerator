'use client';

import { useState } from 'react';
import { Button, Input, Slider, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ShapeStyle {
  color?: string;
  borderColor?: string;
  backgroundColor?: string;
  borderStyle?: string;
  borderWidth?: number;
  rotation?: number;
  opacity?: number;
  zIndex?: number;
}

interface ShapeContentItem {
  id: string;
  type: string;
  value: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: ShapeStyle;
}

interface ShapePropertiesProps {
  selectedShape: ShapeContentItem | null;
  onUpdateShape: (shapeId: string, properties: Partial<ShapeContentItem>) => void;
}

export default function ShapeProperties({ selectedShape, onUpdateShape }: ShapePropertiesProps) {
  const [activeTab, setActiveTab] = useState('style');

  // Color presets
  const colorPresets = [
    '#000000',
    '#FFFFFF',
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F3FF33',
    '#FF33F3',
    '#33FFF3',
    '#FF3333',
    '#6366F1',
  ];

  // No shape selected
  if (!selectedShape) {
    return (
      <div className="p-4 text-gray-400 text-center">
        <div className="mb-4">
          <Icon className="mx-auto" icon="material-symbols:shapes" width={40} />
        </div>
        <p>Select a shape to customize its properties</p>
      </div>
    );
  }

  const handleColorChange = (property: string, color: string) => {
    onUpdateShape(selectedShape.id, {
      style: {
        ...(selectedShape.style || {}),
        [property]: color,
      },
    });
  };

  const handleNumberPropertyChange = (property: keyof ShapeContentItem, value: number) => {
    onUpdateShape(selectedShape.id, {
      [property]: value,
    });
  };

  const handleStylePropertyChange = (property: keyof ShapeStyle, value: any) => {
    onUpdateShape(selectedShape.id, {
      style: {
        ...(selectedShape.style || {}),
        [property]: value,
      },
    });
  };

  const handleBorderStyleChange = (style: string) => {
    onUpdateShape(selectedShape.id, {
      style: {
        ...(selectedShape.style || {}),
        borderStyle: style,
      },
    });
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 w-full">
      <Tabs
        aria-label="Shape Properties"
        className="w-full"
        classNames={{
          tabList: 'bg-transparent p-0 border-b border-gray-800 mb-4',
          cursor: 'bg-indigo-500',
          tab: 'text-gray-400 data-[selected=true]:text-white',
        }}
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
      >
        <Tab
          key="style"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:palette" width={16} />
              <span>Style</span>
            </div>
          }
        />
        <Tab
          key="size"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:straighten" width={16} />
              <span>Size</span>
            </div>
          }
        />
        <Tab
          key="position"
          title={
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:location-on" width={16} />
              <span>Position</span>
            </div>
          }
        />
      </Tabs>

      {activeTab === 'style' && (
        <div className="space-y-4">
          {/* Fill Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="fillColor">
              Fill Color
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colorPresets.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border border-gray-700 ${selectedShape.style?.backgroundColor === color ? 'ring-2 ring-indigo-500' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange('backgroundColor', color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-700"
                style={{
                  backgroundColor: selectedShape.style?.backgroundColor || 'transparent',
                }}
              />
              <Input
                className="flex-1"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                id="fillColor"
                placeholder="#FFFFFF"
                size="sm"
                value={selectedShape.style?.backgroundColor || ''}
                onChange={e => handleColorChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>

          {/* Border Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderStyle">
              Border Style
            </label>
            <div className="flex gap-2" id="borderStyle">
              <Button
                className={selectedShape.style?.borderStyle === 'none' ? 'bg-indigo-600' : ''}
                color={selectedShape.style?.borderStyle === 'none' ? 'primary' : 'default'}
                size="sm"
                variant={selectedShape.style?.borderStyle === 'none' ? 'solid' : 'flat'}
                onPress={() => handleBorderStyleChange('none')}
              >
                None
              </Button>
              <Button
                className={selectedShape.style?.borderStyle === 'solid' ? 'bg-indigo-600' : ''}
                color={selectedShape.style?.borderStyle === 'solid' ? 'primary' : 'default'}
                size="sm"
                variant={selectedShape.style?.borderStyle === 'solid' ? 'solid' : 'flat'}
                onPress={() => handleBorderStyleChange('solid')}
              >
                Solid
              </Button>
              <Button
                className={selectedShape.style?.borderStyle === 'dashed' ? 'bg-indigo-600' : ''}
                color={selectedShape.style?.borderStyle === 'dashed' ? 'primary' : 'default'}
                size="sm"
                variant={selectedShape.style?.borderStyle === 'dashed' ? 'solid' : 'flat'}
                onPress={() => handleBorderStyleChange('dashed')}
              >
                Dashed
              </Button>
              <Button
                className={selectedShape.style?.borderStyle === 'dotted' ? 'bg-indigo-600' : ''}
                color={selectedShape.style?.borderStyle === 'dotted' ? 'primary' : 'default'}
                size="sm"
                variant={selectedShape.style?.borderStyle === 'dotted' ? 'solid' : 'flat'}
                onPress={() => handleBorderStyleChange('dotted')}
              >
                Dotted
              </Button>
            </div>
          </div>

          {/* Border Color */}
          {selectedShape.style?.borderStyle && selectedShape.style.borderStyle !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderColor">
                Border Color
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colorPresets.map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border border-gray-700 ${selectedShape.style?.borderColor === color ? 'ring-2 ring-indigo-500' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange('borderColor', color)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-700"
                  style={{
                    backgroundColor: selectedShape.style?.borderColor || 'transparent',
                  }}
                />
                <Input
                  className="flex-1"
                  classNames={{
                    input: 'bg-gray-800 text-white',
                    inputWrapper: 'bg-gray-800 border-gray-700',
                  }}
                  id="borderColor"
                  placeholder="#FFFFFF"
                  size="sm"
                  value={selectedShape.style?.borderColor || ''}
                  onChange={e => handleColorChange('borderColor', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Border Width */}
          {selectedShape.style?.borderStyle && selectedShape.style.borderStyle !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="borderWidth">
                Border Width: {selectedShape.style?.borderWidth || 1}px
              </label>
              <Slider
                className="max-w-md"
                id="borderWidth"
                maxValue={10}
                minValue={1}
                size="sm"
                step={1}
                value={selectedShape.style?.borderWidth || 1}
                onChange={value => handleStylePropertyChange('borderWidth', value)}
              />
            </div>
          )}

          {/* Opacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="opacity">
              Opacity: {Math.round((selectedShape.style?.opacity || 1) * 100)}%
            </label>
            <Slider
              className="max-w-md"
              id="opacity"
              maxValue={1}
              minValue={0}
              size="sm"
              step={0.05}
              value={selectedShape.style?.opacity || 1}
              onChange={value => handleStylePropertyChange('opacity', value)}
            />
          </div>
        </div>
      )}

      {activeTab === 'size' && (
        <div className="space-y-4">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="width">
              Width: {selectedShape.width || 100}px
            </label>
            <div className="flex items-center gap-2">
              <Slider
                className="max-w-md flex-1"
                id="width"
                maxValue={500}
                minValue={10}
                size="sm"
                step={1}
                value={selectedShape.width || 100}
                onChange={value => handleNumberPropertyChange('width', value as number)}
              />
              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={1000}
                min={10}
                size="sm"
                type="number"
                value={selectedShape.width?.toString() || '100'}
                onChange={e => handleNumberPropertyChange('width', parseInt(e.target.value) || 100)}
              />
            </div>
          </div>

          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Height: {selectedShape.height || 100}px
            </label>
            <div className="flex items-center gap-2">
              <Slider
                className="max-w-md flex-1"
                maxValue={500}
                minValue={10}
                size="sm"
                step={1}
                value={selectedShape.height || 100}
                onChange={value => handleNumberPropertyChange('height', value as number)}
              />
              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={1000}
                min={10}
                size="sm"
                type="number"
                value={selectedShape.height?.toString() || '100'}
                onChange={e =>
                  handleNumberPropertyChange('height', parseInt(e.target.value) || 100)
                }
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rotation: {selectedShape.style?.rotation || 0}°
            </label>
            <div className="flex items-center gap-2">
              <Slider
                className="max-w-md flex-1"
                maxValue={360}
                minValue={0}
                size="sm"
                step={1}
                value={selectedShape.style?.rotation || 0}
                onChange={value => handleStylePropertyChange('rotation', value)}
              />
              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={360}
                min={0}
                size="sm"
                type="number"
                value={selectedShape.style?.rotation?.toString() || '0'}
                onChange={e => handleStylePropertyChange('rotation', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Aspect Ratio Lock */}
          <div className="flex items-center gap-2">
            <Button
              color="default"
              size="sm"
              startContent={<Icon icon="material-symbols:lock" width={16} />}
              variant="flat"
            >
              Lock Aspect Ratio
            </Button>

            <Button
              color="default"
              size="sm"
              startContent={<Icon icon="material-symbols:fit-screen" width={16} />}
              variant="flat"
            >
              Fit to Content
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'position' && (
        <div className="space-y-4">
          {/* X Position */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              X Position: {selectedShape.x || 0}px
            </label>
            <div className="flex items-center gap-2">
              <Slider
                className="max-w-md flex-1"
                maxValue={1000}
                minValue={0}
                size="sm"
                step={1}
                value={selectedShape.x || 0}
                onChange={value => handleNumberPropertyChange('x', value as number)}
              />
              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={2000}
                min={0}
                size="sm"
                type="number"
                value={selectedShape.x?.toString() || '0'}
                onChange={e => handleNumberPropertyChange('x', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Y Position */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Y Position: {selectedShape.y || 0}px
            </label>
            <div className="flex items-center gap-2">
              <Slider
                className="max-w-md flex-1"
                maxValue={1000}
                minValue={0}
                size="sm"
                step={1}
                value={selectedShape.y || 0}
                onChange={value => handleNumberPropertyChange('y', value as number)}
              />
              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                max={2000}
                min={0}
                size="sm"
                type="number"
                value={selectedShape.y?.toString() || '0'}
                onChange={e => handleNumberPropertyChange('y', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Z-Index */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Z-Index (Layer): {selectedShape.style?.zIndex || 1}
            </label>
            <div className="flex items-center gap-2">
              <Button
                color="default"
                size="sm"
                startContent={<Icon icon="material-symbols:flip-to-back" width={16} />}
                variant="flat"
                onPress={() =>
                  handleStylePropertyChange('zIndex', (selectedShape.style?.zIndex || 1) - 1)
                }
              >
                Send Backward
              </Button>

              <Input
                className="w-20"
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper: 'bg-gray-800 border-gray-700',
                }}
                size="sm"
                type="number"
                value={selectedShape.style?.zIndex?.toString() || '1'}
                onChange={e => handleStylePropertyChange('zIndex', parseInt(e.target.value) || 1)}
              />

              <Button
                color="default"
                size="sm"
                startContent={<Icon icon="material-symbols:flip-to-front" width={16} />}
                variant="flat"
                onPress={() =>
                  handleStylePropertyChange('zIndex', (selectedShape.style?.zIndex || 1) + 1)
                }
              >
                Bring Forward
              </Button>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor="alignmentControls"
            >
              Alignment
            </label>
            <div className="flex items-center gap-2" id="alignmentControls">
              <Button isIconOnly aria-label="Align left" color="default" size="sm" variant="flat">
                <Icon icon="material-symbols:align-horizontal-left" width={16} />
              </Button>

              <Button
                isIconOnly
                aria-label="Align center horizontally"
                color="default"
                size="sm"
                variant="flat"
              >
                <Icon icon="material-symbols:align-horizontal-center" width={16} />
              </Button>

              <Button isIconOnly aria-label="Align right" color="default" size="sm" variant="flat">
                <Icon icon="material-symbols:align-horizontal-right" width={16} />
              </Button>

              <div className="h-6 w-px bg-gray-700 mx-1" />

              <Button isIconOnly aria-label="Align top" color="default" size="sm" variant="flat">
                <Icon icon="material-symbols:align-vertical-top" width={16} />
              </Button>

              <Button
                isIconOnly
                aria-label="Align center vertically"
                color="default"
                size="sm"
                variant="flat"
              >
                <Icon icon="material-symbols:align-vertical-center" width={16} />
              </Button>

              <Button isIconOnly aria-label="Align bottom" color="default" size="sm" variant="flat">
                <Icon icon="material-symbols:align-vertical-bottom" width={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
