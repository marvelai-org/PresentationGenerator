"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button, Tooltip } from "@heroui/react";

import { EmbedData } from "./EmbedSelector";

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
  _onMove?: (x: number, y: number) => void;
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
  _onMove,
}: EmbedComponentProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set default dimensions based on embed type if not provided
  const embedWidth = width || embedData.width || 560;
  const embedHeight = height || embedData.height || 315;

  // Calculate aspect ratio for responsive resizing
  const aspectRatio = embedData.aspectRatio || "16:9";
  const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
  const paddingBottom = `${(aspectHeight / aspectWidth) * 100}%`;

  // Handle iframe load events
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setError(null);
  };

  // Handle iframe error events
  const handleIframeError = () => {
    setIframeLoaded(false);
    setError(
      "Failed to load embedded content. Please check the URL and try again.",
    );
  };

  // Render the appropriate embed based on type
  const renderEmbed = () => {
    if (embedData.embedHtml) {
      // If we have pre-generated HTML, use it (but be careful with security)
      return (
        <div
          dangerouslySetInnerHTML={{ __html: embedData.embedHtml }}
          className="absolute inset-0"
        />
      );
    }

    switch (embedData.type) {
      case "youtube":
        const youtubeId = embedData.url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        )?.[1];

        if (!youtubeId)
          return <div className="text-red-500">Invalid YouTube URL</div>;

        return (
          <iframe
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={`YouTube video: ${embedData.title || youtubeId}`}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        );

      case "vimeo":
        const vimeoId = embedData.url.match(
          /vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+)/,
        )?.[1];

        if (!vimeoId)
          return <div className="text-red-500">Invalid Vimeo URL</div>;

        return (
          <iframe
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={`Vimeo video: ${embedData.title || vimeoId}`}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        );

      case "loom":
        const loomId = embedData.url.match(
          /loom\.com\/share\/([a-zA-Z0-9]+)/,
        )?.[1];

        if (!loomId)
          return <div className="text-red-500">Invalid Loom URL</div>;

        return (
          <iframe
            allowFullScreen
            allow="fullscreen"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            src={`https://www.loom.com/embed/${loomId}`}
            title={`Loom video: ${embedData.title || loomId}`}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        );

      case "spotify":
        return (
          <iframe
            allow="encrypted-media"
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            src={embedData.url.replace(
              "open.spotify.com",
              "open.spotify.com/embed",
            )}
            title={`Spotify audio: ${embedData.title || "Spotify embed"}`}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        );

      case "figma":
        return (
          <iframe
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            src={embedData.url.replace("/file/", "/embed/")}
            style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
            title={`Figma design: ${embedData.title || "Figma embed"}`}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        );

      case "custom":
        // For custom embeds, we display a placeholder in editing mode
        // or attempt to render an iframe in presentation mode
        if (isEditing) {
          return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center p-4">
                <Icon
                  className="mx-auto mb-2 text-gray-400"
                  icon="material-symbols:public"
                  width={48}
                />
                <div className="text-white text-sm">
                  {embedData.title || "Custom Embed"}
                </div>
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
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              src={embedData.url}
              title={`Custom embed: ${embedData.title || embedData.url}`}
              onError={handleIframeError}
              onLoad={handleIframeLoad}
            />
          );
        }

      default:
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-red-500">
              Unsupported embed type: {embedData.type}
            </div>
          </div>
        );
    }
  };

  // Style for the container based on selection state
  const containerStyle: React.CSSProperties = {
    width: `${embedWidth}px`,
    height: `${embedHeight}px`,
    position: "absolute",
    left: position?.x !== undefined ? `${position.x}px` : "50%",
    top: position?.y !== undefined ? `${position.y}px` : "50%",
    transform: position?.x === undefined ? "translateX(-50%)" : undefined,
    border: isSelected
      ? "2px solid #6366F1"
      : hovered
        ? "2px solid rgba(99, 102, 241, 0.5)"
        : "none",
    borderRadius: "0.375rem",
    overflow: "hidden",
    boxShadow:
      isSelected || hovered ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
    zIndex: isSelected ? 10 : 1,
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  // Render resize handles if in editing mode and selected
  const renderResizeHandles = () => {
    if (!isEditing || !isSelected || !onResize) return null;

    const handles = [
      { position: "nw", cursor: "nwse-resize", className: "top-0 left-0" },
      {
        position: "n",
        cursor: "ns-resize",
        className: "top-0 left-1/2 transform -translate-x-1/2",
      },
      { position: "ne", cursor: "nesw-resize", className: "top-0 right-0" },
      {
        position: "e",
        cursor: "ew-resize",
        className: "top-1/2 right-0 transform -translate-y-1/2",
      },
      { position: "se", cursor: "nwse-resize", className: "bottom-0 right-0" },
      {
        position: "s",
        cursor: "ns-resize",
        className: "bottom-0 left-1/2 transform -translate-x-1/2",
      },
      { position: "sw", cursor: "nesw-resize", className: "bottom-0 left-0" },
      {
        position: "w",
        cursor: "ew-resize",
        className: "top-1/2 left-0 transform -translate-y-1/2",
      },
    ];

    return handles.map((handle) => (
      <div
        key={handle.position}
        className={`absolute w-3 h-3 bg-indigo-600 rounded-full ${handle.className}`}
        style={{ cursor: handle.cursor }}
        // Add resize logic here when implementing the onResize handler
      />
    ));
  };

  // Render controls for the embed
  const renderControls = () => {
    if (!isEditing || (!isSelected && !hovered)) return null;

    return (
      <div className="absolute top-2 right-2 flex space-x-1 bg-black/70 rounded-md p-1">
        {onEdit && (
          <Tooltip content="Edit" placement="top">
            <Button
              isIconOnly
              className="text-white/80 hover:text-white"
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
              className="text-white/80 hover:text-white"
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

  return (
    <div
      ref={containerRef}
      className="embed-component group"
      style={containerStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Content container with proper aspect ratio */}
      <div className="relative w-full" style={{ paddingBottom }}>
        {/* Loading state */}
        {!iframeLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <Icon
              className="text-indigo-500"
              icon="line-md:loading-twotone-loop"
              width={48}
            />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center p-4">
              <Icon
                className="mx-auto mb-2 text-red-500"
                icon="material-symbols:error"
                width={48}
              />
              <div className="text-white text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Render the appropriate embed */}
        {renderEmbed()}

        {/* Overlay to prevent direct interaction with iframe when in editing mode */}
        {isEditing && (
          <div
            className="absolute inset-0 bg-transparent cursor-move"
            // Add drag logic here when implementing the onMove handler
          />
        )}
      </div>

      {/* Resize handles */}
      {renderResizeHandles()}

      {/* Controls */}
      {renderControls()}
    </div>
  );
}
