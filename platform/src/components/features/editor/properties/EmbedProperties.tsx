'use client';

import { useState, useEffect } from 'react';
import {
  Input,
  Slider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Divider,
  Switch,
  Accordion,
  AccordionItem,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EmbedData } from '../selectors/EmbedSelector';
import { useEmbedHelpers } from '../hooks/useEmbedHelpers';

interface EmbedPropertiesProps {
  selectedEmbed: EmbedData | null;
  onUpdateEmbed: (embedId: string, properties: Partial<EmbedData>) => void;
}

export default function EmbedProperties({ selectedEmbed, onUpdateEmbed }: EmbedPropertiesProps) {
  const [width, setWidth] = useState<number>(560);
  const [height, setHeight] = useState<number>(315);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Get embed helpers
  const { validateUrl, getEmbedTypeInfo } = useEmbedHelpers();

  // Extract embed type info for icons and labels
  const embedTypeInfo = selectedEmbed ? getEmbedTypeInfo(selectedEmbed.type) : null;

  // Set initial state when selected embed changes
  useEffect(() => {
    if (selectedEmbed) {
      setWidth(selectedEmbed.width || 560);
      setHeight(selectedEmbed.height || 315);
      setAspectRatio(selectedEmbed.aspectRatio || '16:9');
      setUrl(selectedEmbed.url || '');

      // Extract autoplay, loop, and controls settings from embedHtml if available
      if (selectedEmbed.embedHtml) {
        setAutoplay(
          selectedEmbed.embedHtml.includes('autoplay=1') ||
            selectedEmbed.embedHtml.includes('autoplay;')
        );
        setLoop(
          selectedEmbed.embedHtml.includes('loop=1') || selectedEmbed.embedHtml.includes('loop;')
        );
        setControls(!selectedEmbed.embedHtml.includes('controls=0'));
      }
    }
  }, [selectedEmbed]);

  // Validate URL when it changes
  useEffect(() => {
    if (selectedEmbed && url) {
      const result = validateUrl(url, selectedEmbed.type);

      setIsValidUrl(result.isValid);
      setUrlError(result.error);
    } else {
      setIsValidUrl(true);
      setUrlError(null);
    }
  }, [url, selectedEmbed, validateUrl]);

  // Handler for aspect ratio lock changes
  const handleAspectRatioLockChange = (shouldMaintain: boolean) => {
    setMaintainAspectRatio(shouldMaintain);

    if (shouldMaintain && selectedEmbed && aspectRatio) {
      // If turning on aspect ratio maintenance, adjust the height
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      const newHeight = Math.round((width * aspectHeight) / aspectWidth);

      setHeight(newHeight);

      if (selectedEmbed) {
        applyChanges({
          height: newHeight,
        });
      }
    }
  };

  // Handler for width changes with aspect ratio maintenance
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);

    if (maintainAspectRatio && aspectRatio) {
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      const newHeight = Math.round((newWidth * aspectHeight) / aspectWidth);

      setHeight(newHeight);

      if (selectedEmbed) {
        applyChanges({
          width: newWidth,
          height: newHeight,
        });
      }
    } else if (selectedEmbed) {
      applyChanges({ width: newWidth });
    }
  };

  // Handler for height changes with aspect ratio maintenance
  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);

    if (maintainAspectRatio && aspectRatio) {
      const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
      const newWidth = Math.round((newHeight * aspectWidth) / aspectHeight);

      setWidth(newWidth);

      if (selectedEmbed) {
        applyChanges({
          width: newWidth,
          height: newHeight,
        });
      }
    } else if (selectedEmbed) {
      applyChanges({ height: newHeight });
    }
  };

  // Handler for aspect ratio changes
  const handleAspectRatioChange = (newAspectRatio: string) => {
    setAspectRatio(newAspectRatio);

    if (maintainAspectRatio && selectedEmbed) {
      const [aspectWidth, aspectHeight] = newAspectRatio.split(':').map(Number);
      const newHeight = Math.round((width * aspectHeight) / aspectWidth);

      setHeight(newHeight);

      applyChanges({
        aspectRatio: newAspectRatio,
        height: newHeight,
      });
    } else if (selectedEmbed) {
      applyChanges({ aspectRatio: newAspectRatio });
    }
  };

  // Handler for position changes
  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    const newPosition = { ...position, [axis]: value };

    setPosition(newPosition);
  };

  // Handler for autoplay, loop, and controls changes
  const handlePlayerOptionChange = (option: 'autoplay' | 'loop' | 'controls', value: boolean) => {
    if (option === 'autoplay') setAutoplay(value);
    if (option === 'loop') setLoop(value);
    if (option === 'controls') setControls(value);

    if (selectedEmbed && selectedEmbed.embedHtml) {
      let updatedHtml = selectedEmbed.embedHtml;

      // Update the embed HTML with the new settings
      if (option === 'autoplay') {
        if (value) {
          if (selectedEmbed.type === 'youtube') {
            updatedHtml = updatedHtml.replace(
              'youtube.com/embed/',
              'youtube.com/embed/?autoplay=1&'
            );
          } else {
            updatedHtml = updatedHtml.replace('allow="', 'allow="autoplay; ');
          }
        } else {
          updatedHtml = updatedHtml.replace('autoplay=1&', '').replace('autoplay; ', '');
        }
      }

      if (option === 'loop') {
        if (value) {
          if (selectedEmbed.type === 'youtube') {
            const videoId = selectedEmbed.url.match(
              /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            )?.[1];

            if (videoId) {
              updatedHtml = updatedHtml.replace(
                'youtube.com/embed/',
                `youtube.com/embed/?loop=1&playlist=${videoId}&`
              );
            }
          }
        } else {
          updatedHtml = updatedHtml.replace(/loop=1&playlist=([a-zA-Z0-9_-]{11})&/, '');
        }
      }

      if (option === 'controls') {
        if (!value) {
          if (selectedEmbed.type === 'youtube') {
            updatedHtml = updatedHtml.replace(
              'youtube.com/embed/',
              'youtube.com/embed/?controls=0&'
            );
          }
        } else {
          updatedHtml = updatedHtml.replace('controls=0&', '');
        }
      }

      applyChanges({ embedHtml: updatedHtml });
    }
  };

  // Handler for URL changes
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (selectedEmbed && isValidUrl) {
      applyChanges({ url: newUrl });
    }
  };

  // Apply changes to the embed
  const applyChanges = (changes: Partial<EmbedData>) => {
    if (selectedEmbed) {
      onUpdateEmbed(selectedEmbed.id, changes);
    }
  };

  // Reset position to center of slide
  const handleCenterEmbed = () => {
    setPosition({ x: 50, y: 50 }); // Center position (percentage based)
    // In a real implementation, this would update the position in the parent component
  };

  // Function to generate common aspect ratio options
  const getAspectRatioOptions = () => [
    { key: '16:9', label: '16:9 - Widescreen' },
    { key: '4:3', label: '4:3 - Standard' },
    { key: '1:1', label: '1:1 - Square' },
    { key: '9:16', label: '9:16 - Portrait' },
    { key: '21:9', label: '21:9 - Ultrawide' },
  ];

  // Function to determine if this is a video embed type
  const isVideoEmbed =
    selectedEmbed?.type === 'youtube' ||
    selectedEmbed?.type === 'vimeo' ||
    selectedEmbed?.type === 'loom';

  // If no embed is selected, show a placeholder
  if (!selectedEmbed) {
    return (
      <div className="text-gray-400 text-center p-4">
        <Icon className="mx-auto mb-2 opacity-50" icon="material-symbols:embed" width={36} />
        <p>Select an embed to customize its properties</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <Accordion className="px-0 gap-2">
        {/* Basic Information */}
        <AccordionItem
          key="basic"
          aria-label="Basic Information"
          classNames={{
            title: 'text-white',
            content: 'text-white',
            indicator: 'text-white',
          }}
          startContent={
            <Icon className="text-gray-400 mr-2" icon="material-symbols:info-outline" width={18} />
          }
          subtitle={<span className="text-gray-400 text-xs">Type and source URL</span>}
          title="Basic Information"
        >
          <div className="space-y-4 py-2">
            {/* Embed type */}
            <div>
              <h3 className="text-sm font-medium mb-2">Embed Type</h3>
              <div className="flex items-center gap-2 p-2 rounded bg-gray-800">
                <Icon
                  className={embedTypeInfo?.color || 'text-gray-400'}
                  icon={embedTypeInfo?.icon || 'material-symbols:code'}
                  width={20}
                />
                <span className="capitalize">{selectedEmbed.type}</span>
              </div>
            </div>

            {/* URL field */}
            <div>
              <h3 className="text-sm font-medium mb-2">URL</h3>
              <Input
                classNames={{
                  input: 'bg-gray-800 text-white',
                  inputWrapper:
                    'bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500',
                }}
                color={urlError ? 'danger' : isValidUrl ? 'success' : 'default'}
                errorMessage={urlError || undefined}
                placeholder="Enter embed URL"
                startContent={
                  <Icon className="text-gray-400" icon="material-symbols:link" width={16} />
                }
                value={url}
                onChange={e => handleUrlChange(e.target.value)}
              />
            </div>
          </div>
        </AccordionItem>

        {/* Size and Position */}
        <AccordionItem
          key="size"
          aria-label="Size & Position"
          classNames={{
            title: 'text-white',
            content: 'text-white',
            indicator: 'text-white',
          }}
          startContent={
            <Icon className="text-gray-400 mr-2" icon="material-symbols:aspect-ratio" width={18} />
          }
          subtitle={
            <span className="text-gray-400 text-xs">
              Dimensions: {width}×{height}
            </span>
          }
          title="Size & Position"
        >
          <div className="space-y-4 py-2">
            {/* Aspect Ratio Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Aspect Ratio</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Lock ratio</span>
                  <Switch
                    color="primary"
                    isSelected={maintainAspectRatio}
                    size="sm"
                    onValueChange={handleAspectRatioLockChange}
                  />
                </div>
              </div>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-full justify-between text-white bg-gray-800 border border-gray-700"
                    endContent={<Icon icon="material-symbols:arrow-drop-down" width={20} />}
                    startContent={
                      <div className="flex items-center gap-1">
                        <Icon icon="material-symbols:aspect-ratio" width={18} />
                        <span>{aspectRatio}</span>
                      </div>
                    }
                    variant="flat"
                  >
                    {getAspectRatioOptions().find(o => o.key === aspectRatio)?.label || aspectRatio}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Aspect Ratios">
                  {getAspectRatioOptions().map(option => (
                    <DropdownItem
                      key={option.key}
                      onPress={() => handleAspectRatioChange(option.key)}
                    >
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* Size controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>Width</span>
                  <span>{width}px</span>
                </div>
                <Input
                  classNames={{
                    input: 'bg-gray-800 text-white',
                    inputWrapper:
                      'bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500',
                  }}
                  max={1920}
                  min={100}
                  startContent={
                    <Icon className="text-gray-400" icon="material-symbols:width" width={16} />
                  }
                  type="number"
                  value={width.toString()}
                  onChange={e => handleWidthChange(parseInt(e.target.value) || 100)}
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span>Height</span>
                  <span>{height}px</span>
                </div>
                <Input
                  classNames={{
                    input: 'bg-gray-800 text-white',
                    inputWrapper:
                      'bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500',
                  }}
                  max={1080}
                  min={100}
                  startContent={
                    <Icon className="text-gray-400" icon="material-symbols:height" width={16} />
                  }
                  type="number"
                  value={height.toString()}
                  onChange={e => handleHeightChange(parseInt(e.target.value) || 100)}
                />
              </div>
            </div>

            {/* Position controls */}
            <div>
              <h3 className="text-sm font-medium mb-2">Position</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>X Position</span>
                    <span>{position.x}%</span>
                  </div>
                  <Slider
                    classNames={{
                      track: 'bg-gray-700',
                      filler: 'bg-indigo-600',
                    }}
                    maxValue={100}
                    minValue={0}
                    size="sm"
                    step={1}
                    value={position.x}
                    onChange={value => handlePositionChange('x', value as number)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-xs">
                    <span>Y Position</span>
                    <span>{position.y}%</span>
                  </div>
                  <Slider
                    classNames={{
                      track: 'bg-gray-700',
                      filler: 'bg-indigo-600',
                    }}
                    maxValue={100}
                    minValue={0}
                    size="sm"
                    step={1}
                    value={position.y}
                    onChange={value => handlePositionChange('y', value as number)}
                  />
                </div>
              </div>

              {/* Alignment buttons */}
              <div className="flex justify-center mt-3">
                <Button
                  className="bg-gray-800 text-white"
                  size="sm"
                  startContent={<Icon icon="material-symbols:align-horizontal-center" width={18} />}
                  variant="flat"
                  onPress={handleCenterEmbed}
                >
                  Center on slide
                </Button>
              </div>
            </div>
          </div>
        </AccordionItem>

        {/* Player Options */}
        <AccordionItem
          key="player"
          aria-label="Player Options"
          classNames={{
            title: 'text-white',
            content: 'text-white',
            indicator: 'text-white',
          }}
          startContent={
            <Icon
              className="text-gray-400 mr-2"
              icon="material-symbols:play-circle-outline"
              width={18}
            />
          }
          subtitle={<span className="text-gray-400 text-xs">Playback settings</span>}
          title="Player Options"
        >
          {isVideoEmbed ? (
            <div className="space-y-3 py-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon
                    className="text-gray-400"
                    icon="material-symbols:play-circle-outline"
                    width={18}
                  />
                  <span className="text-sm">Autoplay</span>
                </div>
                <Switch
                  color="primary"
                  isSelected={autoplay}
                  size="sm"
                  onValueChange={isSelected => handlePlayerOptionChange('autoplay', isSelected)}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon className="text-gray-400" icon="material-symbols:repeat" width={18} />
                  <span className="text-sm">Loop</span>
                </div>
                <Switch
                  color="primary"
                  isSelected={loop}
                  size="sm"
                  onValueChange={isSelected => handlePlayerOptionChange('loop', isSelected)}
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon className="text-gray-400" icon="material-symbols:tune" width={18} />
                  <span className="text-sm">Show Controls</span>
                </div>
                <Switch
                  color="primary"
                  isSelected={controls}
                  size="sm"
                  onValueChange={isSelected => handlePlayerOptionChange('controls', isSelected)}
                />
              </div>
            </div>
          ) : (
            <div className="py-2 text-gray-400 text-center">
              No player options available for this embed type
            </div>
          )}
        </AccordionItem>

        {/* Advanced options */}
        <AccordionItem
          key="advanced"
          aria-label="Advanced Options"
          classNames={{
            title: 'text-white',
            content: 'text-white',
            indicator: 'text-white',
          }}
          startContent={
            <Icon className="text-gray-400 mr-2" icon="material-symbols:code" width={18} />
          }
          title="Advanced Options"
        >
          {selectedEmbed.type === 'custom' ? (
            <div className="py-2">
              <Button
                className="bg-gray-800 text-white w-full mb-2"
                size="sm"
                startContent={<Icon icon="material-symbols:code" width={18} />}
                variant="flat"
                onPress={() => {
                  /* Implement custom code editing */
                }}
              >
                Edit Custom Embed Code
              </Button>
              <p className="text-xs text-gray-400">
                Edit raw HTML code for advanced customization options
              </p>
            </div>
          ) : (
            <div className="py-2 text-gray-400 text-center">
              No advanced options available for this embed type
            </div>
          )}
        </AccordionItem>
      </Accordion>

      {/* Refresh button */}
      <Divider className="bg-gray-700 my-4" />
      <div>
        <Button
          className="bg-gray-800 text-white w-full"
          size="sm"
          startContent={<Icon icon="material-symbols:refresh" width={18} />}
          variant="flat"
          onPress={() => {
            // Implement refresh logic
            if (selectedEmbed) {
              applyChanges({ url: url + '?refresh=' + Date.now() });
              setTimeout(() => applyChanges({ url }), 100);
            }
          }}
        >
          Refresh Embed
        </Button>
        <p className="text-xs text-gray-400 mt-2">
          Update the embed to reflect any content changes
        </p>
      </div>
    </div>
  );
}
