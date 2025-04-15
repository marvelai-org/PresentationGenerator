'use client';

import { useMemo } from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface VideosTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function VideosTab({ searchTerm, onSelect }: VideosTabProps) {
  // Sample video data
  const videos = [
    {
      id: 1,
      url: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Business+Video',
      title: 'Business Presentation',
      duration: '2:15',
    },
    {
      id: 2,
      url: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://placehold.co/600x400/6366f1/ffffff?text=Tutorial+Video',
      title: 'Tutorial Walkthrough',
      duration: '4:30',
    },
    {
      id: 3,
      url: 'https://example.com/video3.mp4',
      thumbnailUrl: 'https://placehold.co/600x400/ec4899/ffffff?text=Marketing+Video',
      title: 'Marketing Campaign',
      duration: '1:45',
    },
  ];

  // Filter videos based on search term
  const filteredVideos = useMemo(() => {
    if (!searchTerm) return videos;

    return videos.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [videos, searchTerm]);

  // If no videos (or none matching search), show empty state
  if (filteredVideos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="material-symbols:videocam" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No videos found</h3>
        {searchTerm ? (
          <p className="text-gray-400">No videos matching "{searchTerm}"</p>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">Upload your own videos to get started</p>
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              Upload video
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <VideoCard key={video.id} video={video} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ video, onSelect }: { video: any; onSelect: (url: string) => void }) {
  return (
    <Card
      isPressable
      className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all overflow-hidden"
      onClick={() => onSelect(video.url)}
    >
      <div className="relative">
        <div
          className="h-40 w-full"
          style={{
            backgroundImage: `url(${video.thumbnailUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <Icon className="text-white" icon="material-symbols:play-arrow" width={24} />
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="text-white text-sm truncate">{video.title}</p>
      </div>
    </Card>
  );
}
