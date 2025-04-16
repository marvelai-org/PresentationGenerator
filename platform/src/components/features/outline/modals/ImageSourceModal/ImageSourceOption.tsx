import React from 'react';
import { Radio } from '@heroui/react';

interface ImageSourceOptionProps {
  value: string;
  title: string;
  description: string;
}

export default function ImageSourceOption({ value, title, description }: ImageSourceOptionProps) {
  return (
    <div className="space-y-1">
      <Radio
        classNames={{
          base: 'inline-flex max-w-md cursor-pointer items-center data-[selected=true]:border-gray-400 border-2 border-[#38383A] rounded-lg gap-4 p-4 hover:bg-[#28282A] transition-colors data-[selected=true]:bg-[#28282A]',
          label: 'text-white',
        }}
        value={value}
      >
        <div className="flex flex-col gap-1">
          <p className="text-base text-white">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </Radio>
    </div>
  );
}
