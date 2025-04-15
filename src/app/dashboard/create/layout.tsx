import React from 'react';

import { Providers } from '@/app/providers';

interface CreateLayoutProps {
  children: React.ReactNode;
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  // This layout has no sidebar, navbar, or user profile at the bottom right
  return (
    <div className="min-h-screen w-full overflow-auto bg-background dark:bg-black">
      <Providers>
        <div className="min-h-screen w-full overflow-auto">{children}</div>
      </Providers>
    </div>
  );
}
