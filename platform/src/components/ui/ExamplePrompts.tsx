'use client';

import React from 'react';
import { Card } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { cn } from '@heroui/react';

interface PromptExample {
  icon: string;
  title: string;
  category?: string;
}

interface ExamplePromptsProps {
  examples: PromptExample[];
  onSelect: (prompt: string) => void;
  className?: string;
  title?: string;
  columns?: number;
  showAddIcon?: boolean;
}

export default function ExamplePrompts({
  examples,
  onSelect,
  className,
  title = 'Example prompts',
  columns = 3,
  showAddIcon = true,
}: ExamplePromptsProps) {
  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-xl text-center text-default-600 mb-6">{title}</h2>

      <div
        className={cn(
          'grid gap-4',
          columns === 1
            ? 'grid-cols-1'
            : columns === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {examples.map((example, index) => (
          <motion.div
            key={index}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              isPressable
              className="bg-content1/10 border border-content2 hover:border-primary cursor-pointer transition-all"
              onPress={() => onSelect(example.title)}
            >
              <div className="flex flex-row items-center gap-3 p-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon className="text-primary" icon={example.icon} width={24} />
                </div>
                <div className="flex-1">
                  {example.category && (
                    <span className="text-xs text-default-400 block mb-1">{example.category}</span>
                  )}
                  <p>{example.title}</p>
                </div>
                {showAddIcon && (
                  <Icon className="text-default-400" icon="material-symbols:add" width={20} />
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
