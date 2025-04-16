'use client';

import React from 'react';
import { TemplatePreview } from '@/components/features/templates';

export default function TemplatePreviewPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Preview</h1>
      <p className="text-gray-500 mb-6">This page demonstrates the new template system with content slots and adaptive layouts.</p>
      
      <TemplatePreview />
    </div>
  );
} 