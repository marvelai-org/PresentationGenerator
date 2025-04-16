import React from 'react';

import { DropIndicatorProps } from '../types/slide';

/**
 * A component that visually indicates where a dragged slide will be dropped
 */
export function DropIndicator({ isActive }: DropIndicatorProps) {
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
