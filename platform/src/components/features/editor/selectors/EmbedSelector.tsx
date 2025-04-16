'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card, Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import Image from 'next/image';

import { useEmbedHelpers } from '../hooks/useEmbedHelpers';

interface EmbedSelectorProps {
  onSelect: (embedData: EmbedData) => void;
  onClose: () => void;
  isOpen: boolean;
}

// Define interface for embed data
export interface EmbedData {
  id: string;
  type: string; // 'youtube', 'vimeo', 'loom', 'spotify', etc.
  url: string;
  title: string;
  thumbnailUrl: string;
  embedHtml?: string;
  width: number;
  height: number;
  aspectRatio: string;
}

// Available embed types with display info
const embedTypes = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'mdi:youtube',
    color: 'text-red-500',
    description: 'Embed YouTube videos in your presentation.',
    placeholder: 'https://www.youtube.com/watch?v=...',
    examples: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ'],
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: 'mdi:vimeo',
    color: 'text-[#1ab7ea]',
    description: 'Add professional videos from Vimeo.',
    placeholder: 'https://vimeo.com/...',
    examples: ['https://vimeo.com/123456789'],
  },
  {
    id: 'loom',
    name: 'Loom',
    icon: 'simple-icons:loom',
    color: 'text-[#625df5]',
    description: 'Include Loom screen recordings.',
    placeholder: 'https://www.loom.com/share/...',
    examples: ['https://www.loom.com/share/abcdef123456'],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: 'mdi:spotify',
    color: 'text-[#1db954]',
    description: 'Add Spotify songs, albums or playlists.',
    placeholder: 'https://open.spotify.com/...',
    examples: ['https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2'],
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: 'simple-icons:figma',
    color: 'text-white',
    description: 'Embed Figma designs and prototypes.',
    placeholder: 'https://www.figma.com/...',
    examples: ['https://www.figma.com/file/abcdefg/My-Design'],
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: 'material-symbols:code',
    color: 'text-indigo-400',
    description: 'Embed any website or custom code.',
    placeholder: 'https://...',
    examples: ['https://example.com'],
  },
];

export default function EmbedSelector({ onSelect, onClose, isOpen }: EmbedSelectorProps) {
  const [activeEmbedType, setActiveEmbedType] = useState('youtube');
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [embedPreview, setEmbedPreview] = useState<EmbedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use our custom hook for embed helpers
  const { validateUrl, generateEmbedData, getExampleUrl, getEmbedTypeInfo } = useEmbedHelpers();

  // Reset state when modal opens or embed type changes
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setEmbedPreview(null);
      setError(null);
    }
  }, [isOpen, activeEmbedType]);

  // Validate URL when it changes
  useEffect(() => {
    if (url) {
      const result = validateUrl(url, activeEmbedType);

      setIsValidUrl(result.isValid);
      if (!result.isValid && result.error) {
        setError(result.error);
      } else {
        setError(null);
      }
    } else {
      setIsValidUrl(false);
      setError(null);
    }
  }, [url, activeEmbedType, validateUrl]);

  const handleGeneratePreview = async () => {
    if (!isValidUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateEmbedData(url, activeEmbedType);

      setEmbedPreview(data);
    } catch (err) {
      console.error('Error generating embed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate embed data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmbed = () => {
    if (embedPreview) {
      onSelect(embedPreview);
      onClose();
    }
  };

  const handleUseExample = () => {
    const example = getExampleUrl(activeEmbedType);

    if (example) {
      setUrl(example);
    }
  };

  // Get current embed type information
  const currentEmbedType = getEmbedTypeInfo(activeEmbedType);

  return (
    <Modal
      classNames={{
        base: 'bg-black border border-gray-800',
        header: 'border-b border-gray-800',
        body: 'p-0', // Remove padding to allow custom layout
      }}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Embed Content</h2>
          <Button
            isIconOnly
            className="text-gray-400 bg-transparent"
            variant="light"
            onPress={onClose}
          >
            <Icon icon="material-symbols:close" width={24} />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="flex h-[500px]">
            {/* Left panel - Embed types */}
            <div className="w-64 border-r border-gray-800 bg-gray-900 shrink-0">
              <div className="p-4 space-y-1">
                {embedTypes.map(type => (
                  <button
                    key={type.id}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
                      activeEmbedType === type.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setActiveEmbedType(type.id)}
                  >
                    <Icon className={type.color} icon={type.icon} width={24} />
                    <span className="text-white">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right panel - Content */}
            <div className="flex-1 bg-black p-6 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-white mb-2">{currentEmbedType?.name}</h3>
                  <p className="text-gray-400 mb-6">{currentEmbedType?.description}</p>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-gray-400">
                          {currentEmbedType?.name} URL
                        </label>
                        <Button
                          className="text-xs text-indigo-400 h-5 px-2 py-0"
                          size="sm"
                          variant="light"
                          onPress={handleUseExample}
                        >
                          Use example
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          classNames={{
                            input: 'bg-gray-800 text-white',
                            inputWrapper: 'bg-gray-800 data-[hover=true]:bg-gray-700',
                          }}
                          color={error ? 'danger' : isValidUrl ? 'success' : 'default'}
                          endContent={
                            isValidUrl ? (
                              <Icon
                                className="text-green-500"
                                icon="material-symbols:check-circle"
                                width={16}
                              />
                            ) : null
                          }
                          placeholder={currentEmbedType?.placeholder}
                          startContent={
                            <Icon
                              className="text-gray-400"
                              icon="material-symbols:link"
                              width={16}
                            />
                          }
                          value={url}
                          onChange={e => setUrl(e.target.value)}
                        />
                        <Button
                          color="primary"
                          isDisabled={!isValidUrl}
                          isLoading={isLoading}
                          onPress={handleGeneratePreview}
                        >
                          Generate
                        </Button>
                      </div>
                      {error && (
                        <p className="text-danger text-sm mt-2 flex items-center gap-1">
                          <Icon icon="material-symbols:error" width={16} />
                          {error}
                        </p>
                      )}
                    </div>

                    {!embedPreview && !error && (
                      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center mt-8">
                        <Icon
                          className={`mx-auto mb-3 ${currentEmbedType?.color}`}
                          icon={currentEmbedType?.icon || 'material-symbols:code'}
                          width={48}
                        />
                        <p className="text-gray-300 mb-2">
                          Enter a {currentEmbedType?.name} URL to preview it here
                        </p>
                        <p className="text-gray-500 text-sm">
                          Example: {currentEmbedType?.examples?.[0]}
                        </p>
                      </div>
                    )}

                    {embedPreview && (
                      <div className="mt-6 animate-fadeIn">
                        <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                          <Icon icon="material-symbols:preview" width={20} />
                          Preview
                        </h3>
                        <Card className="bg-gray-900 border border-gray-800">
                          <div className="p-4">
                            <div className="aspect-video bg-black mb-4 flex items-center justify-center overflow-hidden rounded-lg">
                              <Image
                                alt={embedPreview.title}
                                className="w-full h-auto"
                                height={360}
                                src={embedPreview.thumbnailUrl}
                                unoptimized={embedPreview.thumbnailUrl.startsWith('/')}
                                width={640}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Icon
                                  className={`opacity-80 ${currentEmbedType?.color}`}
                                  icon={currentEmbedType?.icon || 'material-symbols:code'}
                                  width={48}
                                />
                              </div>
                            </div>
                            <h4 className="text-white font-medium">{embedPreview.title}</h4>
                            <p className="text-gray-400 text-sm truncate my-1">
                              {embedPreview.url}
                            </p>
                            <div className="flex gap-2 text-xs text-gray-500 mt-2">
                              <span className="flex items-center gap-1">
                                <Icon icon="material-symbols:aspect-ratio" width={14} />
                                {embedPreview.aspectRatio}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="material-symbols:width" width={14} />
                                {embedPreview.width}px
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon icon="material-symbols:height" width={14} />
                                {embedPreview.height}px
                              </span>
                            </div>

                            <div className="mt-6 flex justify-end">
                              <Button
                                color="primary"
                                startContent={<Icon icon="material-symbols:add" width={20} />}
                                onPress={handleAddEmbed}
                              >
                                Add to Presentation
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                {/* Helpful tips */}
                {!embedPreview && (
                  <div className="mt-8 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Icon icon="material-symbols:lightbulb-outline" width={16} />
                      Tips for embedding {currentEmbedType?.name}
                    </h4>
                    <ul className="text-gray-400 text-sm space-y-2 list-disc list-inside">
                      {activeEmbedType === 'youtube' && (
                        <>
                          <li>Use the share URL from a YouTube video</li>
                          <li>Both youtube.com and youtu.be URLs are supported</li>
                          <li>You'll be able to customize autoplay and controls after adding</li>
                        </>
                      )}
                      {activeEmbedType === 'vimeo' && (
                        <>
                          <li>
                            Use the URL from the browser address bar when viewing a Vimeo video
                          </li>
                          <li>Private videos may require additional permissions</li>
                        </>
                      )}
                      {activeEmbedType === 'loom' && (
                        <>
                          <li>Use the share URL from your Loom recording</li>
                          <li>Make sure your Loom recording is set to public or view-only</li>
                        </>
                      )}
                      {activeEmbedType === 'spotify' && (
                        <>
                          <li>Works with track, album, playlist, and artist URLs</li>
                          <li>Use the share button in Spotify to get the URL</li>
                        </>
                      )}
                      {activeEmbedType === 'figma' && (
                        <>
                          <li>Ensure your Figma file has sharing enabled</li>
                          <li>Both design files and prototypes can be embedded</li>
                        </>
                      )}
                      {activeEmbedType === 'custom' && (
                        <>
                          <li>
                            Not all websites allow embedding - check if the site supports iframe
                            embedding
                          </li>
                          <li>Some sites may require additional permissions or authentication</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
