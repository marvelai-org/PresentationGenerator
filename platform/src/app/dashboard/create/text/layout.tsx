import { ReactNode } from 'react';

import { Providers } from '@/app/providers';

interface TextLayoutProps {
  children: ReactNode;
}

export default function TextLayout({ children }: TextLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <div className="bg-black h-screen w-screen">
      <Providers>
        <div className="h-screen w-screen overflow-hidden">{children}</div>
      </Providers>
    </div>
  );
}
