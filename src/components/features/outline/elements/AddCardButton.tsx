import React from 'react';
import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { AddCardButtonProps } from '../types/slide';

/**
 * Button component for adding a new slide card at a specific position
 */
export function AddCardButton({ onClick, index }: AddCardButtonProps) {
  return (
    <div className="relative h-3 my-0.5 group z-10 flex items-center hover:cursor-pointer">
      {/* Horizontal line that appears on hover */}
      <div className="absolute inset-x-0 h-[1px] bg-primary/30 opacity-0 group-hover:opacity-100 group-hover:bg-primary/70 transition-all duration-200" />

      {/* Centered button container that appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Tooltip content="Add card" placement="top">
          <Button
            isIconOnly
            className="bg-primary text-white rounded-full shadow-sm scale-90 hover:scale-100 z-20
                      transition-all duration-200 w-6 h-6 min-w-0 flex items-center justify-center"
            size="sm"
            onPress={() => onClick(index)}
          >
            <Icon icon="material-symbols:add" width={14} />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
