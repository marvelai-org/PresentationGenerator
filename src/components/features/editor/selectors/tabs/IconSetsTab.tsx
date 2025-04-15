'use client';

import { useMemo } from 'react';
import { Icon } from '@iconify/react';

interface IconSetsTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function IconSetsTab({ searchTerm, onSelect }: IconSetsTabProps) {
  // Define icon sets
  const iconSets = [
    {
      id: 'phosphor',
      name: 'Phosphor',
      publisher: 'Phosphor Icons',
      icons: [
        { id: 'diamond', icon: 'ph:diamond', style: 'outline' },
        { id: 'rocket', icon: 'ph:rocket', style: 'outline' },
        { id: 'star', icon: 'ph:star', style: 'outline' },
        { id: 'cloud', icon: 'ph:cloud', style: 'outline' },
        { id: 'folder', icon: 'ph:folder', style: 'outline' },
        { id: 'lock', icon: 'ph:lock', style: 'outline' },
      ],
    },
    {
      id: 'phosphor-filled',
      name: 'Phosphor Filled',
      publisher: 'Phosphor Icons',
      icons: [
        { id: 'diamond-fill', icon: 'ph:diamond-fill', style: 'filled' },
        { id: 'rocket-fill', icon: 'ph:rocket-fill', style: 'filled' },
        { id: 'star-fill', icon: 'ph:star-fill', style: 'filled' },
        { id: 'cloud-fill', icon: 'ph:cloud-fill', style: 'filled' },
        { id: 'folder-fill', icon: 'ph:folder-fill', style: 'filled' },
        { id: 'lock-fill', icon: 'ph:lock-fill', style: 'filled' },
      ],
    },
    {
      id: 'phosphor-duotone',
      name: 'Phosphor Duotone',
      publisher: 'Phosphor Icons',
      icons: [
        { id: 'diamond-duotone', icon: 'ph:diamond-duotone', style: 'duotone' },
        { id: 'rocket-duotone', icon: 'ph:rocket-duotone', style: 'duotone' },
        { id: 'star-duotone', icon: 'ph:star-duotone', style: 'duotone' },
        { id: 'cloud-duotone', icon: 'ph:cloud-duotone', style: 'duotone' },
        { id: 'folder-duotone', icon: 'ph:folder-duotone', style: 'duotone' },
        { id: 'lock-duotone', icon: 'ph:lock-duotone', style: 'duotone' },
      ],
    },
    {
      id: 'doodle',
      name: 'Doodle',
      publisher: 'Khushmeen',
      icons: [
        { id: 'diamond-doodle', icon: 'ph:diamond-light', style: 'doodle' },
        { id: 'rocket-doodle', icon: 'ph:rocket-light', style: 'doodle' },
        { id: 'star-doodle', icon: 'ph:star-light', style: 'doodle' },
        { id: 'cloud-doodle', icon: 'ph:cloud-light', style: 'doodle' },
        { id: 'folder-doodle', icon: 'ph:folder-light', style: 'doodle' },
        { id: 'lock-doodle', icon: 'ph:lock-light', style: 'doodle' },
      ],
    },
  ];

  // Filter icon sets based on search term
  const filteredIconSets = useMemo(() => {
    if (!searchTerm) return iconSets;

    return iconSets
      .map(set => ({
        ...set,
        icons: set.icons.filter(
          icon =>
            icon.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            set.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(set => set.icons.length > 0);
  }, [iconSets, searchTerm]);

  if (filteredIconSets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="material-symbols:category" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No icons found</h3>
        <p className="text-gray-400">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {filteredIconSets.map(set => (
        <div key={set.id} className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">{set.name}</h2>
            <button className="text-indigo-400 text-sm flex items-center">
              More <Icon icon="material-symbols:chevron-right" width={16} />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-3">
            {set.icons.map(icon => (
              <button
                key={icon.id}
                className="bg-gray-800 text-white hover:bg-gray-700 h-16 rounded-lg flex items-center justify-center transition-colors"
                onClick={() => onSelect(`icon:${icon.icon}`)}
              >
                <Icon icon={icon.icon} width={28} />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
