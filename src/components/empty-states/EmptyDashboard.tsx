'use client';

import React from 'react';
import { Button, Card } from '@heroui/react';
import { Icon } from '@iconify/react';

interface EmptyDashboardProps {
  onCreateNew: () => void;
}

export default function EmptyDashboard({ onCreateNew }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 relative">
        <div className="rounded-full bg-blue-500/10 p-6">
          <Icon className="text-blue-500 w-16 h-16" icon="material-symbols:slideshow" />
        </div>
        <div className="absolute -top-2 -right-2 rounded-full bg-blue-500 p-2">
          <Icon className="text-white w-4 h-4" icon="material-symbols:add" />
        </div>
      </div>
      
      <h2 className="text-2xl font-medium text-white mb-2">Create your first presentation</h2>
      
      <p className="text-gray-400 max-w-md mb-8">
        Use AI to generate stunning presentations quickly. Just enter a topic, choose a style,
        and let our AI do the work.
      </p>
      
      <Button 
        size="lg" 
        color="primary" 
        className="rounded-full px-8"
        startContent={<Icon icon="material-symbols:add" width={24} />}
        onClick={onCreateNew}
      >
        Create New Presentation
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-3xl">
        <Card className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-start">
            <div className="rounded-full bg-indigo-500/10 p-3 mr-4">
              <Icon className="text-indigo-400 w-6 h-6" icon="material-symbols:bolt" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium mb-1">Fast Generation</h3>
              <p className="text-gray-400 text-sm">Create presentations in seconds, not hours</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-start">
            <div className="rounded-full bg-purple-500/10 p-3 mr-4">
              <Icon className="text-purple-400 w-6 h-6" icon="material-symbols:auto-awesome" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium mb-1">AI Content</h3>
              <p className="text-gray-400 text-sm">Smart content generation with accurate info</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-start">
            <div className="rounded-full bg-rose-500/10 p-3 mr-4">
              <Icon className="text-rose-400 w-6 h-6" icon="material-symbols:dashboard-customize" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium mb-1">Customizable</h3>
              <p className="text-gray-400 text-sm">Easy to edit and make it your own</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 