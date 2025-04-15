'use client';

import React from 'react';
import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { cn } from '@heroui/react';

interface SlideContent {
  id: number;
  title: string;
  bullets: string[];
}

interface OutlineSlideCardProps {
  slide: SlideContent;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  className?: string;
  animationDelay?: number;
}

export default function OutlineSlideCard({
  slide,
  onDelete,
  onEdit,
  onDuplicate,
  className,
  animationDelay = 0,
}: OutlineSlideCardProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      transition={{
        duration: 0.3,
        delay: animationDelay * 0.05,
        ease: 'easeOut',
      }}
    >
      <Card className="bg-content1/10 border border-content2 hover:border-content3 transition-all">
        <div className="flex p-4">
          {/* Slide Number */}
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-md text-primary mr-4">
            {slide.id}
          </div>

          {/* Slide Content */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{slide.title}</h3>
            <ul className="list-disc pl-5 text-default-600 space-y-1">
              {slide.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className={cn(
                    'transition-opacity duration-300',
                    index > 2 ? 'opacity-70' : 'opacity-100'
                  )}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-1">
            {onEdit && (
              <Button
                isIconOnly
                className="text-default-500"
                size="sm"
                variant="light"
                onPress={() => onEdit(slide.id)}
              >
                <Icon icon="material-symbols:edit-outline" width={18} />
              </Button>
            )}

            {onDuplicate && (
              <Button
                isIconOnly
                className="text-default-500"
                size="sm"
                variant="light"
                onPress={() => onDuplicate(slide.id)}
              >
                <Icon icon="material-symbols:content-copy-outline" width={18} />
              </Button>
            )}

            {onDelete && (
              <Button
                isIconOnly
                className="text-default-500"
                size="sm"
                variant="light"
                onPress={() => onDelete(slide.id)}
              >
                <Icon icon="material-symbols:delete-outline" width={18} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
