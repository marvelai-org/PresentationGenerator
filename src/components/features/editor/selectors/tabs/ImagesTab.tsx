'use client';

import { useMemo } from 'react';
import { Card } from '@heroui/react';

interface ImagesTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function ImagesTab({ searchTerm, onSelect }: ImagesTabProps) {
  // Sample image data (in a real app, you'd fetch this from your backend or API)
  const images = [
    {
      id: 1,
      url: '/climate-earth.jpg',
      type: 'abstract',
      title: 'Earth Abstract',
    },
    {
      id: 2,
      url: 'https://placehold.co/600x400/3b82f6/ffffff?text=Blue+Abstract',
      type: 'abstract',
      title: 'Blue Abstract',
    },
    {
      id: 3,
      url: 'https://placehold.co/600x400/6366f1/ffffff?text=Data+Visualization',
      type: 'data',
      title: 'Data Visualization',
    },
    {
      id: 4,
      url: 'https://placehold.co/600x400/ec4899/ffffff?text=Colorful+Abstract',
      type: 'abstract',
      title: 'Colorful Abstract',
    },
    {
      id: 5,
      url: 'https://placehold.co/600x400/06b6d4/ffffff?text=Technology',
      type: 'tech',
      title: 'Technology',
    },
    {
      id: 6,
      url: 'https://placehold.co/600x400/14b8a6/ffffff?text=3D+Shapes',
      type: '3d',
      title: '3D Shapes',
    },
  ];

  // Filter images based on search term
  const filteredImages = useMemo(() => {
    if (!searchTerm) return images;

    return images.filter(
      image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [images, searchTerm]);

  // Group images by type for category display
  const imageCategories = useMemo(() => {
    const categories: Record<string, typeof images> = {};

    filteredImages.forEach(image => {
      if (!categories[image.type]) {
        categories[image.type] = [];
      }
      categories[image.type].push(image);
    });

    return categories;
  }, [filteredImages]);

  // If search is active, show filtered results without categories
  if (searchTerm) {
    return (
      <div>
        <h2 className="text-lg font-medium text-white mb-4">
          Search Results: {filteredImages.length} found
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {filteredImages.map(image => (
            <ImageCard key={image.id} image={image} onSelect={onSelect} />
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No images found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    );
  }

  // Otherwise show categorized content
  return (
    <div className="space-y-8">
      {Object.entries(imageCategories).map(([category, images]) => (
        <div key={category}>
          <h2 className="text-lg font-medium text-white mb-4 capitalize">{category}</h2>
          <div className="grid grid-cols-3 gap-4">
            {images.map(image => (
              <ImageCard key={image.id} image={image} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper component for image cards
function ImageCard({ image, onSelect }: { image: any; onSelect: (url: string) => void }) {
  return (
    <Card
      isPressable
      className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all overflow-hidden"
      onClick={() => onSelect(image.url)}
    >
      <div
        className="h-40 w-full"
        style={{
          backgroundImage: `url(${image.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-2">
        <p className="text-white text-sm truncate">{image.title}</p>
      </div>
    </Card>
  );
}
