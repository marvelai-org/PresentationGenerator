import React from 'react';

import { Providers } from '@/app/providers';

interface ImportLayoutProps {
  children: React.ReactNode;
}

export default function ImportLayout({ children }: ImportLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <div className="bg-background min-h-screen w-full">
      <Providers>
        <div className="min-h-screen w-full overflow-auto">{children}</div>
      </Providers>
    </div>
  );
}
