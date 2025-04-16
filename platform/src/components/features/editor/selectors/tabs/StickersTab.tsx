'use client';

import { useMemo } from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface StickersTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function StickersTab({ searchTerm, onSelect }: StickersTabProps) {
  // Sample sticker categories
  const stickerCategories = [
    {
      id: 'look',
      title: 'Look at This',
      items: [
        { id: 'arrow1', url: '/stickers/arrow1.png' },
        { id: 'arrow2', url: '/stickers/arrow2.png' },
        { id: 'hot', url: '/stickers/hot.png' },
        { id: 'look', url: '/stickers/look.png' },
        { id: 'open', url: '/stickers/open.png' },
        { id: 'stars', url: '/stickers/stars.png' },
      ],
    },
    {
      id: 'mark',
      title: 'Mark It Up',
      items: [
        { id: 'circle', url: '/stickers/circle.png' },
        { id: 'rectangle', url: '/stickers/rectangle.png' },
        { id: 'highlight', url: '/stickers/highlight.png' },
        { id: 'underline', url: '/stickers/underline.png' },
        { id: 'squiggle', url: '/stickers/squiggle.png' },
        { id: 'star-rating', url: '/stickers/star-rating.png' },
      ],
    },
    {
      id: 'make',
      title: 'Make Your Point',
      items: [
        { id: 'circle-solid', url: '/stickers/circle-solid.png' },
        { id: 'oval', url: '/stickers/oval.png' },
        { id: 'box', url: '/stickers/box.png' },
        { id: 'dashed', url: '/stickers/dashed.png' },
        { id: 'bracket', url: '/stickers/bracket.png' },
        { id: 'underline2', url: '/stickers/underline2.png' },
      ],
    },
    {
      id: 'team',
      title: 'Teamwork',
      items: [
        { id: 'teamwork1', url: '/stickers/teamwork1.png' },
        { id: 'teamwork2', url: '/stickers/teamwork2.png' },
        { id: 'teamwork3', url: '/stickers/teamwork3.png' },
        { id: 'teamwork4', url: '/stickers/teamwork4.png' },
        { id: 'teamwork5', url: '/stickers/teamwork5.png' },
        { id: 'teamwork6', url: '/stickers/teamwork6.png' },
      ],
    },
  ];

  // Filter sticker categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return stickerCategories;

    return stickerCategories
      .map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.title.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(category => category.items.length > 0);
  }, [stickerCategories, searchTerm]);

  if (filteredCategories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="material-symbols:sticker" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No stickers found</h3>
        <p className="text-gray-400">Try a different search term</p>
      </div>
    );
  }

  // For each category, render stickers
  return (
    <div className="space-y-10">
      {filteredCategories.map(category => (
        <div key={category.id} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">{category.title}</h2>
            <button className="text-indigo-400 text-sm flex items-center">
              More <Icon icon="material-symbols:chevron-right" width={16} />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {category.items.map(item => (
              <StickerCard key={item.id} sticker={item} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StickerCard({ sticker, onSelect }: { sticker: any; onSelect: (url: string) => void }) {
  return (
    <Card
      isPressable
      className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all h-16 flex items-center justify-center overflow-hidden"
      onClick={() => onSelect(sticker.url)}
    >
      {/* In a real app, you'd use actual sticker images */}
      <div className="h-10 w-10 bg-indigo-500 rounded-md" title={sticker.id} />
    </Card>
  );
}
