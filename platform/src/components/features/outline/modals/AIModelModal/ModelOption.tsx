import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface AIModelDetails {
  key: string;
  name: string;
  provider: string;
  description: string;
  bestFor: string[];
  speed: number;
  exampleImage?: string;
}

interface ModelOptionProps {
  model: AIModelDetails;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  // Get appropriate icon based on model key
  const getModelIcon = (modelKey: string): string => {
    if (modelKey.includes('Flux')) {
      return 'heroicons:cube-transparent';
    } else if (modelKey.includes('Imagen')) {
      return 'ri:star-fill';
    } else if (modelKey.includes('Ideogram')) {
      return 'ri:rhythm-fill';
    } else if (modelKey.includes('Leonardo')) {
      return 'ri:user-fill';
    } else if (modelKey.includes('DALL')) {
      return 'ri:shape-fill';
    } else if (modelKey.includes('Recraft')) {
      return 'ri:shape-2-fill';
    } else {
      return 'material-symbols:auto-awesome';
    }
  };

  // Generate speed indicator based on model speed level (1-4)
  const renderSpeedIndicator = (speed: number) => {
    const bars = [];

    for (let i = 0; i < 4; i++) {
      bars.push(
        <div
          key={i}
          className={`h-1.5 rounded-full w-full ${i < speed ? 'bg-primary' : 'bg-gray-600/30'}`}
        />
      );
    }

    return <div className="grid grid-cols-4 gap-1 w-full">{bars}</div>;
  };

  // Placeholder image URL if none provided
  const defaultImage =
    'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=500&h=280&fit=crop&q=80';

  // Get category tag for each feature
  const getFeatureIcon = (feature: string): string => {
    if (feature.toLowerCase().includes('realistic')) return 'material-symbols:hdr-auto-outline';
    if (feature.toLowerCase().includes('artistic')) return 'material-symbols:brush';
    if (feature.toLowerCase().includes('color')) return 'material-symbols:palette-outline';
    if (feature.toLowerCase().includes('text')) return 'material-symbols:text-fields';
    if (feature.toLowerCase().includes('people') || feature.toLowerCase().includes('face'))
      return 'material-symbols:person';

    return 'material-symbols:auto-awesome';
  };

  return (
    <Card
      isPressable
      className={`w-full h-full overflow-hidden transition-all duration-150 ${
        isSelected
          ? 'border-2 border-primary bg-[#1C1C1E] shadow-[0_0_0_1px_rgba(99,102,241,0.3)]'
          : 'border border-[#38383A] bg-[#1C1C1E] hover:bg-[#28282A] hover:border-[#4A4A4C]'
      }`}
      shadow="none"
      onPress={onSelect}
    >
      {/* Example Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-800">
        <img
          alt={`${model.name} example`}
          className="w-full h-full object-cover"
          src={model.exampleImage || defaultImage}
        />
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
          Example
        </span>
      </div>

      <div className="p-3 text-left flex flex-col">
        {/* Model Name and Icon */}
        <div className="flex items-center gap-1.5 mb-3 text-left">
          <Icon className="text-primary flex-shrink-0" icon={getModelIcon(model.key)} width={18} />
          <h3 className="text-base font-semibold text-white line-clamp-1 text-left">
            {model.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 mb-3 line-clamp-2 min-h-[32px] text-left">
          {model.description}
        </p>

        {/* Speed Section */}
        <div className="mb-3 text-left">
          <div className="text-gray-400 text-xs mb-1 text-left">Speed</div>
          {renderSpeedIndicator(model.speed)}
        </div>

        {/* Best For Section */}
        <div className="text-left">
          <div className="text-gray-400 text-xs mb-1 text-left">Best for</div>
          <div className="flex flex-row flex-wrap gap-2">
            {model.bestFor.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-[#28282A] rounded-full px-2 py-0.5 text-left"
              >
                <Icon
                  className="text-primary flex-shrink-0"
                  icon={getFeatureIcon(feature)}
                  width={12}
                />
                <span className="text-gray-300 text-xs text-left">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
