"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "@heroui/react";

import CommandMenuModal from "../CommandMenuModal";

interface EmbedSelectorProps {
  onSelect: (embedData: EmbedData) => void;
  onClose: () => void;
  isOpen: boolean;
}

// Define interface for embed data
export interface EmbedData {
  id: string;
  type: string; // 'youtube', 'vimeo', 'loom', 'spotify', 'custom', etc.
  url: string;
  title: string;
  thumbnailUrl: string;
  embedHtml?: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export default function EmbedSelector({
  onSelect,
  onClose,
  isOpen,
}: EmbedSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("youtube");
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [embedPreview, setEmbedPreview] = useState<EmbedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL validation patterns for different platforms
  const urlPatterns = {
    youtube:
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/,
    vimeo:
      /^(https?:\/\/)?(www\.)?(vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+))(\S*)?$/,
    loom: /^(https?:\/\/)?(www\.)?(loom\.com\/share\/[a-zA-Z0-9]+)(\S*)?$/,
    spotify:
      /^(https?:\/\/)?(open\.spotify\.com\/(track|album|playlist|episode|show)\/[a-zA-Z0-9]+)(\S*)?$/,
    figma:
      /^(https?:\/\/)?(www\.)?(figma\.com\/(file|proto)\/[a-zA-Z0-9]+)(\S*)?$/,
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl("");
      setEmbedPreview(null);
      setError(null);
    }
  }, [isOpen]);

  // Validate URL based on selected platform
  useEffect(() => {
    const pattern = urlPatterns[activeTab as keyof typeof urlPatterns];

    if (pattern && url) {
      setIsValidUrl(pattern.test(url));
    } else if (activeTab === "custom" && url) {
      // For custom embeds, we'll accept any URL for now
      setIsValidUrl(url.startsWith("http://") || url.startsWith("https://"));
    } else {
      setIsValidUrl(false);
    }

    // Reset preview and error when URL or tab changes
    setEmbedPreview(null);
    setError(null);
  }, [url, activeTab]);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );

    return match ? match[1] : null;
  };

  // Extract video ID from Vimeo URL
  const getVimeoVideoId = (url: string): string | null => {
    const match = url.match(
      /vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+)/,
    );

    return match ? match[1] : null;
  };

  // Extract share ID from Loom URL
  const getLoomShareId = (url: string): string | null => {
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);

    return match ? match[1] : null;
  };

  // Generate embed data based on the URL and platform
  const generateEmbedData = async () => {
    if (!isValidUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      let embedData: EmbedData;

      switch (activeTab) {
        case "youtube": {
          const videoId = getYouTubeVideoId(url);

          if (!videoId) {
            throw new Error("Invalid YouTube URL");
          }
          embedData = {
            id: `youtube-${videoId}`,
            type: "youtube",
            url,
            title: `YouTube Video (${videoId})`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            embedHtml: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            width: 560,
            height: 315,
            aspectRatio: "16:9",
          };
          break;
        }
        case "vimeo": {
          const videoId = getVimeoVideoId(url);

          if (!videoId) {
            throw new Error("Invalid Vimeo URL");
          }
          embedData = {
            id: `vimeo-${videoId}`,
            type: "vimeo",
            url,
            title: `Vimeo Video (${videoId})`,
            thumbnailUrl: "https://vumbnail.com/" + videoId + ".jpg", // Use vumbnail service for vimeo thumbnails
            embedHtml: `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
            width: 640,
            height: 360,
            aspectRatio: "16:9",
          };
          break;
        }
        case "loom": {
          const shareId = getLoomShareId(url);

          if (!shareId) {
            throw new Error("Invalid Loom URL");
          }
          embedData = {
            id: `loom-${shareId}`,
            type: "loom",
            url,
            title: `Loom Recording (${shareId})`,
            thumbnailUrl: "/loom-placeholder.jpg", // Default placeholder
            embedHtml: `<iframe src="https://www.loom.com/embed/${shareId}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen width="640" height="360"></iframe>`,
            width: 640,
            height: 360,
            aspectRatio: "16:9",
          };
          break;
        }
        case "spotify": {
          // Simple check for valid Spotify URL
          if (!url.includes("open.spotify.com")) {
            throw new Error("Invalid Spotify URL");
          }
          embedData = {
            id: `spotify-${Date.now()}`,
            type: "spotify",
            url,
            title: "Spotify Content",
            thumbnailUrl: "/spotify-placeholder.jpg", // Default placeholder
            embedHtml: `<iframe src="${url.replace("open.spotify.com", "open.spotify.com/embed")}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`,
            width: 300,
            height: 380,
            aspectRatio: "4:5",
          };
          break;
        }
        case "figma": {
          if (!url.includes("figma.com")) {
            throw new Error("Invalid Figma URL");
          }
          embedData = {
            id: `figma-${Date.now()}`,
            type: "figma",
            url,
            title: "Figma Design",
            thumbnailUrl: "/figma-placeholder.jpg", // Default placeholder
            embedHtml: `<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="${url.replace("/file/", "/embed/")}" allowfullscreen></iframe>`,
            width: 800,
            height: 450,
            aspectRatio: "16:9",
          };
          break;
        }
        case "custom": {
          // For custom embeds, we provide default values
          embedData = {
            id: `custom-${Date.now()}`,
            type: "custom",
            url,
            title: "Custom Embed",
            thumbnailUrl: "/custom-placeholder.jpg", // Default placeholder
            width: 600,
            height: 400,
            aspectRatio: "3:2",
          };
          break;
        }
        default:
          throw new Error("Unsupported platform");
      }

      setEmbedPreview(embedData);
    } catch (err) {
      console.error("Error generating embed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate embed data",
      );
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

  const renderYoutubeTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a YouTube video URL to embed in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  // Create similar functions for other platforms
  const renderVimeoTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a Vimeo video URL to embed in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="Vimeo URL"
            placeholder="https://vimeo.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderLoomTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a Loom recording URL to embed in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="Loom URL"
            placeholder="https://www.loom.com/share/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderSpotifyTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a Spotify URL to embed in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="Spotify URL"
            placeholder="https://open.spotify.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderFigmaTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a Figma file URL to embed in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="Figma URL"
            placeholder="https://www.figma.com/file/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomTab = () => (
    <div className="p-4">
      <p className="text-default-600 mb-4">
        Enter a URL to embed custom content in your presentation.
      </p>
      <div className="space-y-4">
        <div>
          <Input
            classNames={{
              input: "bg-content1 text-default-900",
              inputWrapper: "bg-content1 data-[hover=true]:bg-content2",
            }}
            label="URL to Embed"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <Button
          color="primary"
          isDisabled={!isValidUrl}
          isLoading={isLoading}
          onPress={generateEmbedData}
        >
          Generate Preview
        </Button>

        {embedPreview && (
          <div className="mt-6">
            <h3 className="text-default-700 font-medium mb-2">Preview</h3>
            <Card className="bg-content2">
              <div className="p-4">
                <div className="aspect-video bg-black mb-3 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    alt={embedPreview.title}
                    className="w-full h-auto"
                    src={embedPreview.thumbnailUrl}
                  />
                </div>
                <h4 className="text-default-900 font-medium">
                  {embedPreview.title}
                </h4>
                <p className="text-default-500 text-sm truncate">
                  {embedPreview.url}
                </p>

                <div className="mt-6 flex justify-end">
                  <Button color="primary" onPress={handleAddEmbed}>
                    Add to Presentation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    {
      key: "youtube",
      title: "YouTube",
      icon: "mdi:youtube",
      content: renderYoutubeTab(),
    },
    {
      key: "vimeo",
      title: "Vimeo",
      icon: "mdi:vimeo",
      content: renderVimeoTab(),
    },
    {
      key: "loom",
      title: "Loom",
      icon: "mdi:video",
      content: renderLoomTab(),
    },
    {
      key: "spotify",
      title: "Spotify",
      icon: "mdi:spotify",
      content: renderSpotifyTab(),
    },
    {
      key: "figma",
      title: "Figma",
      icon: "simple-icons:figma",
      content: renderFigmaTab(),
    },
    {
      key: "custom",
      title: "Custom",
      icon: "material-symbols:code",
      content: renderCustomTab(),
    },
  ];

  return (
    <CommandMenuModal
      isOpen={isOpen}
      modalSize="3xl"
      searchPlaceholder="Search embeds..."
      showSearch={false}
      tabs={tabs}
      title="Embed Content"
      onClose={onClose}
      onSearch={setSearchTerm}
    />
  );
}
