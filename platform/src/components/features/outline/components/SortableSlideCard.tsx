import type { SlideContent } from '../types/slide';

import React, { useState, useEffect } from 'react';
import { Card, Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

import UnifiedSlideEditor from './UnifiedSlideEditor';

interface SortableSlideCardProps {
  slide: SlideContent;
  onDelete: (id: number) => void;
  onContentChange: (id: number, content: string) => void;
  recentlyDroppedId: number | null;
}

export default function SortableSlideCard({
  slide,
  onDelete,
  onContentChange,
  recentlyDroppedId,
}: SortableSlideCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting, over } =
    useSortable({
      id: slide.id,
      transition: {
        duration: 200, // Reduced for more responsive feel
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition, // Disable transition during drag to avoid conflicts
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1, // Increased base z-index
    position: 'relative' as const,
  };

  const [isHovered, setIsHovered] = useState(false);

  // Calculate if this is the drop target
  const isOver = over?.id === slide.id;

  // Check if this card was recently dropped
  const wasRecentlyDropped = recentlyDroppedId === slide.id;

  // Log drag state for debugging
  useEffect(() => {
    if (isDragging) {
      console.log(`Dragging slide ${slide.id}, transform:`, transform);
    }
  }, [isDragging, slide.id, transform]);

  return (
    <motion.div
      ref={setNodeRef}
      animate={{
        opacity: 1,
        y: 0,
        scale: isOver ? 1.01 : 1,
      }}
      initial={{ opacity: 0, y: 10 }}
      style={style}
      transition={{ duration: 0.3 }}
      {...attributes}
      className={`relative group ${isDragging ? 'py-0' : 'py-0'}`} // Explicitly set zero padding
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`border border-transparent rounded-xl overflow-hidden transition-all duration-200 
          bg-[#323234] shadow-[0_2px_6px_rgba(0,0,0,0.15)]
          ${isDragging ? 'shadow-lg ring-1 ring-primary/20' : ''}
          ${isSorting && isOver ? 'border-primary/40 bg-primary/5' : ''}
          ${wasRecentlyDropped ? 'highlight-animation' : ''}
          ${isHovered ? 'shadow-md border-primary/40 scale-[1.005]' : ''}
        `}
      >
        <div className="flex items-stretch">
          <div
            className={`min-w-[4rem] w-16 flex-shrink-0 flex items-start justify-start pl-3 pr-3 pt-3 text-primary bg-[#2D2D2F] relative 
              ${isDragging ? 'cursor-grabbing bg-[#38383F]' : 'cursor-grab hover:bg-[#35353A]'} 
              transition-colors duration-150`}
            {...listeners} // Move listeners to entire container
          >
            {/* Drag handle indicator that appears on hover */}
            <div className="absolute left-1 top-3 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
              <div className="flex items-center justify-start hover:text-primary transition-colors duration-150">
                <Icon icon="material-symbols:drag-indicator" width={18} />
              </div>
            </div>

            <div className="text-xl font-medium select-none text-center w-full">{slide.id}</div>
          </div>

          <div className="flex-1 py-3 px-4 cursor-text focus-within:ring-1 focus-within:ring-primary/30 focus-within:rounded flex items-start">
            <UnifiedSlideEditor
              content={slide.content}
              placeholder="Title...\n\n• Bullet point..."
              onChange={value => onContentChange(slide.id, value)}
            />
          </div>

          <div
            className={`p-2 flex items-start justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Tooltip content="Delete card" placement="top">
              <Button
                isIconOnly
                className="text-default-500 hover:text-danger hover:bg-danger-50 dark:hover:bg-danger-900/20 cursor-pointer"
                variant="light"
                onPress={() => onDelete(slide.id)}
              >
                <Icon icon="material-symbols:delete-outline" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
