'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Tooltip, Badge } from '@heroui/react';
import { motion } from 'framer-motion';

import { EmbedData } from '../selectors/EmbedSelector';
import { useEmbedHelpers } from '../hooks/useEmbedHelpers';

interface EmbedComponentProps {
  embedData: EmbedData;
  isEditing?: boolean;
  isSelected?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
  onResize?: (width: number, height: number) => void;
  onMove?: (x: number, y: number) => void;
}

export default function EmbedComponent({
  embedData,
  isEditing = false,
  isSelected = false,
  onDelete,
  onEdit,
  width,
  height,
  position,
  onResize,
  onMove,
}: EmbedComponentProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({ isDragging: false, startX: 0, startY: 0 });

  // Get embed helpers
  const { getEmbedTypeInfo } = useEmbedHelpers();
  const embedTypeInfo = getEmbedTypeInfo(embedData.type);

  // Set default dimensions based on embed type if not provided
  const embedWidth = width || embedData.width || 560;
  const embedHeight = height || embedData.height || 315;

  // Calculate aspect ratio for responsive resizing
  const aspectRatio = embedData.aspectRatio || '16:9';
  const [aspectWidth, aspectHeight] = aspectRatio.split(':').map(Number);
  const paddingBottom = `${(aspectHeight / aspectWidth) * 100}%`;

  // Handle resize mousemove
  const handleResizeMouseMove = (e: MouseEvent, direction: string) => {
    if (!containerRef.current || !onResize) return;

    const rect = containerRef.current.getBoundingClientRect();

    let newWidth = embedWidth;
    let newHeight = embedHeight;

    // Calculate new dimensions based on direction
    if (direction.includes('e')) {
      newWidth = Math.max(100, e.clientX - rect.left);
    } else if (direction.includes('w')) {
      newWidth = Math.max(100, rect.right - e.clientX);
    }

    if (direction.includes('s')) {
      newHeight = Math.max(100, e.clientY - rect.top);
    } else if (direction.includes('n')) {
      newHeight = Math.max(100, rect.bottom - e.clientY);
    }

    // Apply resize with aspect ratio if needed
    if (embedData.aspectRatio && (direction.includes('n') || direction.includes('s'))) {
      newWidth = (newHeight * aspectWidth) / aspectHeight;
    } else if (embedData.aspectRatio && (direction.includes('e') || direction.includes('w'))) {
      newHeight = (newWidth * aspectHeight) / aspectWidth;
    }

    onResize(Math.round(newWidth), Math.round(newHeight));
  };

  // Setup drag handlers for moving the embed
  useEffect(() => {
    if (!isEditing || !isSelected || !containerRef.current || !onMove) return;

    const container = containerRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      // Ignore if we're clicking on a resize handle or control button
      if (
        (e.target as HTMLElement).closest('.resize-handle') ||
        (e.target as HTMLElement).closest('.control-button')
      ) {
        return;
      }

      dragInfo.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragInfo.current.isDragging || !containerRef.current) return;

      const dx = e.clientX - dragInfo.current.startX;
      const dy = e.clientY - dragInfo.current.startY;

      const rect = containerRef.current.getBoundingClientRect();
      const parentRect = containerRef.current.parentElement?.getBoundingClientRect();

      if (parentRect) {
        // Calculate new position based on parent container
        const newX = ((rect.left - parentRect.left + dx) / parentRect.width) * 100;
        const newY = ((rect.top - parentRect.top + dy) / parentRect.height) * 100;

        onMove(Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
      }

      dragInfo.current.startX = e.clientX;
      dragInfo.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      dragInfo.current.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    container.addEventListener('mousedown', handleMouseDown);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEditing, isSelected, onMove]);

  // Setup resize handlers
  useEffect(() => {
    if (!isEditing || !isSelected || !onResize) return;

    const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
    const listeners: { [key: string]: () => void } = {};

    directions.forEach(direction => {
      const handleMouseDown = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const handleMouseMove = (e: MouseEvent) => {
          handleResizeMouseMove(e, direction);
        };

        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };

      const element = document.getElementById(`resize-${direction}-${embedData.id}`);

      if (element) {
        element.addEventListener('mousedown', handleMouseDown);
        listeners[direction] = () => element.removeEventListener('mousedown', handleMouseDown);
      }
    });

    return () => {
      // Clean up all resize listeners
      Object.values(listeners).forEach(removeListener => removeListener());
    };
  }, [isEditing, isSelected, onResize, embedData.id, embedWidth, embedHeight]);

  // Render the appropriate embed based on type
  const renderEmbed = () => {
    if (status === 'error') {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-center p-4">
            <Icon className="mx-auto mb-2 text-red-500" icon="material-symbols:error" width={48} />
            <div className="text-white text-sm">{error}</div>
            <Button className="mt-4" color="primary" size="sm" onPress={() => setStatus('loading')}>
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (status === 'loading') {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 rounded-lg">
          <motion.div
            animate={{ rotate: 360 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Icon
              className={`text-indigo-500 ${embedTypeInfo?.color || ''}`}
              icon="svg-spinners:180-ring"
              width={48}
            />
          </motion.div>
          <p className="text-gray-400 mt-3 text-sm">Loading {embedData.type} content...</p>
        </div>
      );
    }

    if (embedData.embedHtml) {
      // For security, we use iframe-based rendering instead of dangerouslySetInnerHTML
      // This provides an extra layer of isolation
      return (
        <iframe
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          srcDoc={`<!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; overflow: hidden; background: #000; }
                  iframe { border: 0; width: 100%; height: 100%; }
                </style>
              </head>
              <body>
                ${embedData.embedHtml}
              </body>
            </html>`}
          onError={() => {
            setStatus('error');
            setError('Failed to load embedded content');
          }}
          onLoad={() => setStatus('loaded')}
        />
      );
    }

    switch (embedData.type) {
      case 'youtube':
        const youtubeId = embedData.url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        )?.[1];

        if (!youtubeId) {
          setStatus('error');
          setError('Invalid YouTube URL');

          return null;
        }

        return (
          <iframe
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={`YouTube video: ${embedData.title || youtubeId}`}
            onError={() => {
              setStatus('error');
              setError('Failed to load YouTube video');
            }}
            onLoad={() => setStatus('loaded')}
          />
        );

      case 'vimeo':
        const vimeoId = embedData.url.match(
          /vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+)/
        )?.[1];

        if (!vimeoId) {
          setStatus('error');
          setError('Invalid Vimeo URL');

          return null;
        }

        return (
          <iframe
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={`Vimeo video: ${embedData.title || vimeoId}`}
            onError={() => {
              setStatus('error');
              setError('Failed to load Vimeo video');
            }}
            onLoad={() => setStatus('loaded')}
          />
        );

      case 'loom':
        const loomId = embedData.url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)?.[1];

        if (!loomId) {
          setStatus('error');
          setError('Invalid Loom URL');

          return null;
        }

        return (
          <iframe
            allowFullScreen
            allow="fullscreen"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            src={`https://www.loom.com/embed/${loomId}`}
            title={`Loom video: ${embedData.title || loomId}`}
            onError={() => {
              setStatus('error');
              setError('Failed to load Loom video');
            }}
            onLoad={() => setStatus('loaded')}
          />
        );

      case 'spotify':
        return (
          <iframe
            allow="encrypted-media"
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            src={embedData.url.replace('open.spotify.com', 'open.spotify.com/embed')}
            title={`Spotify audio: ${embedData.title || 'Spotify embed'}`}
            onError={() => {
              setStatus('error');
              setError('Failed to load Spotify content');
            }}
            onLoad={() => setStatus('loaded')}
          />
        );

      case 'figma':
        return (
          <iframe
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-lg"
            src={embedData.url.replace('/file/', '/embed/')}
            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
            title={`Figma design: ${embedData.title || 'Figma embed'}`}
            onError={() => {
              setStatus('error');
              setError('Failed to load Figma design');
            }}
            onLoad={() => setStatus('loaded')}
          />
        );

      case 'custom':
        // For custom embeds, we display a placeholder in editing mode
        // or attempt to render an iframe in presentation mode
        if (isEditing) {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center p-4">
                <Icon
                  className="mx-auto mb-2 text-gray-400"
                  icon="material-symbols:public"
                  width={48}
                />
                <div className="text-white text-sm">{embedData.title || 'Custom Embed'}</div>
                <div className="text-gray-400 text-xs mt-1 max-w-xs mx-auto truncate">
                  {embedData.url}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <iframe
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-lg"
              frameBorder="0"
              src={embedData.url}
              title={`Custom embed: ${embedData.title || embedData.url}`}
              onError={() => {
                setStatus('error');
                setError('Failed to load custom content');
              }}
              onLoad={() => setStatus('loaded')}
            />
          );
        }

      default:
        setStatus('error');
        setError(`Unsupported embed type: ${embedData.type}`);

        return null;
    }
  };

  // Style for the container based on selection state
  const containerStyle: React.CSSProperties = {
    width: `${embedWidth}px`,
    height: `${embedHeight}px`,
    position: 'absolute',
    left: position?.x !== undefined ? `${position.x}%` : '50%',
    top: position?.y !== undefined ? `${position.y}%` : '50%',
    transform: position?.x === undefined ? 'translate(-50%, -50%)' : 'translate(0, 0)',
    border: isSelected
      ? '2px solid #6366F1'
      : hovered
        ? '2px solid rgba(99, 102, 241, 0.5)'
        : '2px solid transparent',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: isSelected
      ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(99, 102, 241, 0.8)'
      : hovered
        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
        : '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: isSelected ? 10 : 1,
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  };

  // Render resize handles if in editing mode and selected
  const renderResizeHandles = () => {
    if (!isEditing || !isSelected || !onResize) return null;

    const handles = [
      { id: 'nw', position: 'nw', cursor: 'nwse-resize', className: 'top-0 left-0' },
      { id: 'n', position: 'n', cursor: 'ns-resize', className: 'top-0 left-1/2 -translate-x-1/2' },
      { id: 'ne', position: 'ne', cursor: 'nesw-resize', className: 'top-0 right-0' },
      {
        id: 'e',
        position: 'e',
        cursor: 'ew-resize',
        className: 'top-1/2 right-0 -translate-y-1/2',
      },
      { id: 'se', position: 'se', cursor: 'nwse-resize', className: 'bottom-0 right-0' },
      {
        id: 's',
        position: 's',
        cursor: 'ns-resize',
        className: 'bottom-0 left-1/2 -translate-x-1/2',
      },
      { id: 'sw', position: 'sw', cursor: 'nesw-resize', className: 'bottom-0 left-0' },
      { id: 'w', position: 'w', cursor: 'ew-resize', className: 'top-1/2 left-0 -translate-y-1/2' },
    ];

    return handles.map(handle => (
      <div
        key={handle.id}
        className={`resize-handle absolute w-3 h-3 bg-indigo-600 rounded-full ${handle.className} z-20`}
        id={`resize-${handle.id}-${embedData.id}`}
        style={{
          cursor: handle.cursor,
          transform: handle.className.includes('translate')
            ? handle.className.includes('-translate-x-1/2')
              ? 'translate(-50%, 0)'
              : 'translate(0, -50%)'
            : 'translate(0, 0)',
        }}
      />
    ));
  };

  // Render controls for the embed
  const renderControls = () => {
    if (!isEditing || (!isSelected && !hovered)) return null;

    return (
      <div className="absolute top-2 right-2 flex space-x-1 bg-black/70 rounded-md p-1 z-10 control-buttons">
        {onEdit && (
          <Tooltip content="Edit" placement="top">
            <Button
              isIconOnly
              className="control-button text-white/80 hover:text-white bg-transparent"
              size="sm"
              variant="light"
              onPress={onEdit}
            >
              <Icon icon="material-symbols:edit" width={16} />
            </Button>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip content="Delete" placement="top">
            <Button
              isIconOnly
              className="control-button text-white/80 hover:text-white bg-transparent"
              size="sm"
              variant="light"
              onPress={onDelete}
            >
              <Icon icon="material-symbols:delete" width={16} />
            </Button>
          </Tooltip>
        )}
      </div>
    );
  };

  // Render embed type badge
  const renderTypeBadge = () => {
    if (!isEditing || (!isSelected && !hovered)) return null;

    return (
      <Badge className="absolute left-2 top-2 z-10" size="sm" variant="flat">
        <div className="flex items-center gap-1">
          <Icon
            className={embedTypeInfo?.color}
            icon={embedTypeInfo?.icon || 'material-symbols:code'}
            width={14}
          />
          <span>{embedTypeInfo?.name || embedData.type}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div
      ref={containerRef}
      className="embed-component group"
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Type badge */}
      {renderTypeBadge()}

      {/* Content container with proper aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom }}>
        {/* Render the embed content */}
        {renderEmbed()}

        {/* Overlay to prevent direct interaction with iframe when in editing mode */}
        {isEditing && isSelected && (
          <div className="absolute inset-0 bg-transparent cursor-move z-5" />
        )}
      </div>

      {/* Resize handles */}
      {renderResizeHandles()}

      {/* Controls */}
      {renderControls()}
    </div>
  );
}
