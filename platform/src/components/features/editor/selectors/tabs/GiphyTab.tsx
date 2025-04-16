'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface GiphyTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function GiphyTab({ searchTerm, onSelect }: GiphyTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gifs, setGifs] = useState<any[]>([]);
  const [categories] = useState<string[]>([
    'Money',
    'Thank you',
    'Team',
    'Questions',
    'Wow',
    'Celebrate',
    'Funny',
  ]);

  // Placeholder GIFs
  const placeholderGifs = [
    {
      id: 'g1',
      url: 'https://placehold.co/300x200/3b82f6/ffffff?text=Happy+Dance',
      title: 'Happy Dance',
      user: { display_name: 'GIPHY Official' },
    },
    {
      id: 'g2',
      url: 'https://placehold.co/300x200/6366f1/ffffff?text=Thumbs+Up',
      title: 'Thumbs Up',
      user: { display_name: 'GIPHY Official' },
    },
    {
      id: 'g3',
      url: 'https://placehold.co/300x200/ec4899/ffffff?text=Applause',
      title: 'Applause',
      user: { display_name: 'GIPHY Official' },
    },
    {
      id: 'g4',
      url: 'https://placehold.co/300x200/06b6d4/ffffff?text=Mind+Blown',
      title: 'Mind Blown',
      user: { display_name: 'GIPHY Official' },
    },
  ];

  // Simulate loading and fetching data when search term changes
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      setGifs(placeholderGifs);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter GIFs based on search term
  const filteredGifs = useMemo(() => {
    if (!searchTerm) return gifs;

    return gifs.filter(gif => gif.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [gifs, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon className="text-indigo-500 animate-spin" icon="material-symbols:refresh" width={32} />
      </div>
    );
  }

  // Show categories if no search term
  if (!searchTerm) {
    return (
      <div>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Categories</h2>
          <div className="text-xs text-gray-400 flex items-center">
            <Icon className="mr-1" icon="simple-icons:giphy" width={14} />
            <span>Powered by GIPHY</span>
          </div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {categories.map(category => (
            <a
              key={category}
              className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-white p-3 rounded-lg text-center cursor-pointer"
              href={`#search=${category}`}
              onClick={e => {
                e.preventDefault();
                // Instead of directly setting search term, we'll pass the category via URL hash
                // This is just a workaround - in a real implementation you'd use a callback
                window.location.hash = `search=${category}`;
                // Manually trigger search through parent component
                const searchEvent = new CustomEvent('giphy-search', {
                  detail: { term: category },
                });

                window.dispatchEvent(searchEvent);
              }}
            >
              {category}
            </a>
          ))}
        </div>

        {/* Trending GIFs */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-white mb-4">Trending GIFs</h2>
          <div className="grid grid-cols-3 gap-4">
            {gifs.map(gif => (
              <GiphyCard key={gif.id} gif={gif} onSelect={onSelect} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show search results
  if (filteredGifs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="simple-icons:giphy" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No GIFs found</h3>
        <p className="text-gray-400">Try a different search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Results for "{searchTerm}"</h2>
        <div className="text-xs text-gray-400 flex items-center">
          <Icon className="mr-1" icon="simple-icons:giphy" width={14} />
          <span>Powered by GIPHY</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredGifs.map(gif => (
          <GiphyCard key={gif.id} gif={gif} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function GiphyCard({ gif, onSelect }: { gif: any; onSelect: (url: string) => void }) {
  return (
    <Card
      isPressable
      className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all overflow-hidden"
      onClick={() => onSelect(gif.url)}
    >
      <div
        className="h-40 w-full"
        style={{
          backgroundImage: `url(${gif.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="p-2">
        <p className="text-white text-sm truncate">{gif.title}</p>
      </div>
    </Card>
  );
}
