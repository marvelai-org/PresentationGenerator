'use client';

import { useCallback } from 'react';

import { EmbedData } from '../selectors/EmbedSelector';

// Define the embedTypes here as well for easy access to config
const embedTypes = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'mdi:youtube',
    color: 'text-red-500',
    description: 'Embed YouTube videos in your presentation.',
    placeholder: 'https://www.youtube.com/watch?v=...',
    examples: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://youtu.be/dQw4w9WgXcQ'],
    pattern:
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/,
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    icon: 'mdi:vimeo',
    color: 'text-[#1ab7ea]',
    description: 'Add professional videos from Vimeo.',
    placeholder: 'https://vimeo.com/...',
    examples: ['https://vimeo.com/123456789'],
    pattern:
      /^(https?:\/\/)?(www\.)?(vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+))(\S*)?$/,
  },
  {
    id: 'loom',
    name: 'Loom',
    icon: 'simple-icons:loom',
    color: 'text-[#625df5]',
    description: 'Include Loom screen recordings.',
    placeholder: 'https://www.loom.com/share/...',
    examples: ['https://www.loom.com/share/abcdef123456'],
    pattern: /^(https?:\/\/)?(www\.)?(loom\.com\/share\/[a-zA-Z0-9]+)(\S*)?$/,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: 'mdi:spotify',
    color: 'text-[#1db954]',
    description: 'Add Spotify songs, albums or playlists.',
    placeholder: 'https://open.spotify.com/...',
    examples: ['https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2'],
    pattern:
      /^(https?:\/\/)?(open\.spotify\.com\/(track|album|playlist|episode|show)\/[a-zA-Z0-9]+)(\S*)?$/,
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: 'simple-icons:figma',
    color: 'text-white',
    description: 'Embed Figma designs and prototypes.',
    placeholder: 'https://www.figma.com/...',
    examples: ['https://www.figma.com/file/abcdefg/My-Design'],
    pattern: /^(https?:\/\/)?(www\.)?(figma\.com\/(file|proto)\/[a-zA-Z0-9]+)(\S*)?$/,
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: 'material-symbols:code',
    color: 'text-indigo-400',
    description: 'Embed any website or custom code.',
    placeholder: 'https://...',
    examples: ['https://example.com'],
    pattern: /^(https?:\/\/)(.+)$/, // Simple pattern for any URL with http/https
  },
];

export function useEmbedHelpers() {
  // Helper to extract video ID from YouTube URL
  const getYouTubeVideoId = useCallback((url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);

    return match ? match[1] : null;
  }, []);

  // Helper to extract video ID from Vimeo URL
  const getVimeoVideoId = useCallback((url: string): string | null => {
    const match = url.match(
      /vimeo\.com\/(?!categories|channels|groups|ondemand|album|showcase)([0-9]+)/
    );

    return match ? match[1] : null;
  }, []);

  // Helper to extract share ID from Loom URL
  const getLoomShareId = useCallback((url: string): string | null => {
    const match = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);

    return match ? match[1] : null;
  }, []);

  // Validate URL based on selected platform
  const validateUrl = useCallback((url: string, type: string) => {
    const embedType = embedTypes.find(t => t.id === type);

    if (!embedType) {
      return {
        isValid: false,
        error: 'Unknown embed type',
      };
    }

    if (!url) {
      return {
        isValid: false,
        error: null, // No error for empty URL
      };
    }

    if (embedType.pattern.test(url)) {
      return {
        isValid: true,
        error: null,
      };
    }

    // Custom error messages based on type
    let errorMessage = `Invalid ${embedType.name} URL format`;

    if (type === 'youtube') {
      errorMessage =
        'Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=videoID or https://youtu.be/videoID)';
    } else if (type === 'vimeo') {
      errorMessage = 'Please enter a valid Vimeo URL (e.g., https://vimeo.com/videoID)';
    } else if (type === 'loom') {
      errorMessage =
        'Please enter a valid Loom share URL (e.g., https://www.loom.com/share/abcdef123456)';
    }

    return {
      isValid: false,
      error: errorMessage,
    };
  }, []);

  // Generate embed data based on the URL and platform
  const generateEmbedData = useCallback(
    async (url: string, type: string): Promise<EmbedData> => {
      // Validate URL first
      const validation = validateUrl(url, type);

      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid URL');
      }

      try {
        let embedData: EmbedData;

        switch (type) {
          case 'youtube': {
            const videoId = getYouTubeVideoId(url);

            if (!videoId) {
              throw new Error('Invalid YouTube URL');
            }

            embedData = {
              id: `youtube-${videoId}`,
              type: 'youtube',
              url,
              title: `YouTube Video (${videoId})`,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              embedHtml: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
              width: 560,
              height: 315,
              aspectRatio: '16:9',
            };
            break;
          }

          case 'vimeo': {
            const videoId = getVimeoVideoId(url);

            if (!videoId) {
              throw new Error('Invalid Vimeo URL');
            }

            embedData = {
              id: `vimeo-${videoId}`,
              type: 'vimeo',
              url,
              title: `Vimeo Video (${videoId})`,
              thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`, // Vimeo thumbnail service
              embedHtml: `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`,
              width: 640,
              height: 360,
              aspectRatio: '16:9',
            };
            break;
          }

          case 'loom': {
            const shareId = getLoomShareId(url);

            if (!shareId) {
              throw new Error('Invalid Loom URL');
            }

            embedData = {
              id: `loom-${shareId}`,
              type: 'loom',
              url,
              title: `Loom Recording (${shareId})`,
              thumbnailUrl: '/loom-placeholder.jpg', // Default placeholder
              embedHtml: `<iframe src="https://www.loom.com/embed/${shareId}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen width="640" height="360"></iframe>`,
              width: 640,
              height: 360,
              aspectRatio: '16:9',
            };
            break;
          }

          case 'spotify': {
            // Simple check for valid Spotify URL
            if (!url.includes('open.spotify.com')) {
              throw new Error('Invalid Spotify URL');
            }

            embedData = {
              id: `spotify-${Date.now()}`,
              type: 'spotify',
              url,
              title: 'Spotify Content',
              thumbnailUrl: '/spotify-placeholder.jpg', // Default placeholder
              embedHtml: `<iframe src="${url.replace('open.spotify.com', 'open.spotify.com/embed')}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`,
              width: 300,
              height: 380,
              aspectRatio: '4:5',
            };
            break;
          }

          case 'figma': {
            if (!url.includes('figma.com')) {
              throw new Error('Invalid Figma URL');
            }

            embedData = {
              id: `figma-${Date.now()}`,
              type: 'figma',
              url,
              title: 'Figma Design',
              thumbnailUrl: '/figma-placeholder.jpg', // Default placeholder
              embedHtml: `<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="${url.replace('/file/', '/embed/')}" allowfullscreen></iframe>`,
              width: 800,
              height: 450,
              aspectRatio: '16:9',
            };
            break;
          }

          case 'custom': {
            // For custom embeds, we provide default values
            embedData = {
              id: `custom-${Date.now()}`,
              type: 'custom',
              url,
              title: 'Custom Embed',
              thumbnailUrl: '/custom-placeholder.jpg', // Default placeholder
              width: 600,
              height: 400,
              aspectRatio: '3:2',
            };
            break;
          }

          default:
            throw new Error('Unsupported platform');
        }

        return embedData;
      } catch (err) {
        console.error('Error in generateEmbedData:', err);
        throw err;
      }
    },
    [getYouTubeVideoId, getLoomShareId, getVimeoVideoId, validateUrl]
  );

  // Get an example URL for the selected platform
  const getExampleUrl = useCallback((type: string): string => {
    const embedType = embedTypes.find(t => t.id === type);

    if (embedType && embedType.examples && embedType.examples.length > 0) {
      return embedType.examples[0];
    }

    return '';
  }, []);

  // Get information about an embed type
  const getEmbedTypeInfo = useCallback((type: string) => {
    return embedTypes.find(t => t.id === type);
  }, []);

  // Return all the helpers
  return {
    validateUrl,
    generateEmbedData,
    getExampleUrl,
    getEmbedTypeInfo,
    embedTypes,
  };
}
