import React from 'react';

import { Providers } from '@/app/providers';
import './styles.css';

interface EditorLayoutProps {
  children: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  // This layout has no sidebar or navbar, just the content
  return (
    <div className="bg-black h-screen w-screen">
      <Providers>
        <div className="h-screen w-screen overflow-hidden">{children}</div>
      </Providers>
    </div>
  );
}
