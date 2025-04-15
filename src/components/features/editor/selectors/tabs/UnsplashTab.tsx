'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface UnsplashTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function UnsplashTab({ searchTerm, onSelect }: UnsplashTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  // Placeholder photos (in a real app, you'd fetch from Unsplash API)
  const placeholderPhotos = [
    {
      id: 'u1',
      urls: { regular: 'https://placehold.co/600x400/3b82f6/ffffff?text=Mountain+View' },
      alt_description: 'Mountain View',
      user: { name: 'John Doe', username: 'johndoe' },
    },
    {
      id: 'u2',
      urls: { regular: 'https://placehold.co/600x400/6366f1/ffffff?text=Ocean+Wave' },
      alt_description: 'Ocean Wave',
      user: { name: 'Jane Smith', username: 'janesmith' },
    },
    {
      id: 'u3',
      urls: { regular: 'https://placehold.co/600x400/ec4899/ffffff?text=Forest+Trail' },
      alt_description: 'Forest Trail',
      user: { name: 'Alex Johnson', username: 'alexj' },
    },
    {
      id: 'u4',
      urls: { regular: 'https://placehold.co/600x400/06b6d4/ffffff?text=City+Skyline' },
      alt_description: 'City Skyline',
      user: { name: 'Sam Wilson', username: 'samw' },
    },
  ];

  // Simulate loading and fetching data when search term changes
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      setPhotos(placeholderPhotos);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter photos based on search term
  const filteredPhotos = useMemo(() => {
    if (!searchTerm) return photos;

    return photos.filter(photo =>
      photo.alt_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [photos, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon className="text-indigo-500 animate-spin" icon="material-symbols:refresh" width={32} />
      </div>
    );
  }

  if (filteredPhotos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="simple-icons:unsplash" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No photos found</h3>
        <p className="text-gray-400">Try a different search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">
          {searchTerm ? `Results for "${searchTerm}"` : 'Featured Photos'}
        </h2>
        <div className="text-xs text-gray-400 flex items-center">
          <Icon className="mr-1" icon="simple-icons:unsplash" width={14} />
          <span>Powered by Unsplash</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredPhotos.map(photo => (
          <UnsplashCard key={photo.id} photo={photo} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function UnsplashCard({ photo, onSelect }: { photo: any; onSelect: (url: string) => void }) {
  return (
    <Card
      isPressable
      className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all overflow-hidden"
      onClick={() => onSelect(photo.urls.regular)}
    >
      <div
        className="h-48 w-full"
        style={{
          backgroundImage: `url(${photo.urls.regular})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-2 flex justify-between items-center">
        <p className="text-white text-sm truncate">{photo.alt_description}</p>
        <div className="text-xs text-gray-400">by {photo.user.name}</div>
      </div>
    </Card>
  );
}
