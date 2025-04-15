'use client';

import { useState, useEffect } from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface BrandfetchTabProps {
  searchTerm: string;
  onSelect: (mediaUrl: string) => void;
}

export default function BrandfetchTab({ searchTerm, onSelect }: BrandfetchTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);

  // Placeholder brands
  const placeholderBrands = [
    {
      id: 'pitch',
      name: 'Pitch',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=Pitch',
    },
    {
      id: 'disney',
      name: 'Disney',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=Disney',
    },
    {
      id: 'ecosia',
      name: 'Ecosia',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=Ecosia',
    },
    {
      id: 'patagonia',
      name: 'Patagonia',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=Patagonia',
    },
    {
      id: 'wwf',
      name: 'WWF',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=WWF',
    },
    {
      id: 'brandfetch',
      name: 'Brandfetch',
      logo: 'https://placehold.co/200x100/333333/ffffff?text=Brandfetch',
    },
  ];

  // Simulate loading and fetching data when search term changes
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      setBrands(
        placeholderBrands.filter(
          brand => !searchTerm || brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon className="text-indigo-500 animate-spin" icon="material-symbols:refresh" width={32} />
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Icon className="text-gray-400 mx-auto" icon="material-symbols:logo-dev" width={48} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No logos found</h3>
        <p className="text-gray-400">Try a different search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-white mb-4">
          {searchTerm ? `Results for "${searchTerm}"` : 'Quickly find up-to-date logos'}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {brands.map(brand => (
            <Card
              key={brand.id}
              isPressable
              className="bg-gray-800 border border-gray-700 hover:border-gray-500 transition-all h-24 flex items-center justify-center p-4"
              onClick={() => onSelect(brand.logo)}
            >
              <img
                alt={brand.name}
                className="max-h-full max-w-full object-contain"
                src={brand.logo}
              />
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        <p>Most brands and logos are protected by trademark and copyright law.</p>
        <button className="text-indigo-400 underline">Review our rules about fair use</button>
      </div>
    </div>
  );
}
