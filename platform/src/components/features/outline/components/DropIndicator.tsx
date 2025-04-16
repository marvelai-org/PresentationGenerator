import React from 'react';

interface DropIndicatorProps {
  isActive: boolean;
}

export default function DropIndicator({ isActive }: DropIndicatorProps) {
  return (
    <div
      className={`h-1 rounded-full my-0 bg-primary transition-all duration-150 ${
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      }`}
      style={{
        transformOrigin: 'center',
        transition: 'opacity 150ms ease, transform 150ms ease',
      }}
    />
  );
}
