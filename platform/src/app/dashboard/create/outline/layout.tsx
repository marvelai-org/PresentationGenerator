import { ReactNode } from 'react';

import { Providers } from '@/app/providers';

interface OutlineLayoutProps {
  children: ReactNode;
}

export default function OutlineLayout({ children }: OutlineLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <div className="bg-black h-screen w-screen">
      <Providers>
        <div className="h-screen w-screen overflow-y-auto">{children}</div>
      </Providers>
    </div>
  );
}
