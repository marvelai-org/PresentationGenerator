'use client';

import React from 'react';

import { Providers } from '@/app/providers';

interface GenerateLayoutProps {
  children: React.ReactNode;
}

export default function GenerateLayout({ children }: GenerateLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <div className="bg-black h-screen w-screen">
      <Providers>
        <div className="h-screen w-screen overflow-hidden">{children}</div>
      </Providers>
    </div>
  );
}
