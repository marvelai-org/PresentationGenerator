"use client";

import { ReactNode } from "react";
import { Providers } from "@/app/providers";

interface GenerateLayoutProps {
  children: ReactNode;
}

export default function GenerateLayout({ children }: GenerateLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <html lang="en" className="dark">
      <body className="bg-black">
        <Providers>
          <div className="h-screen w-screen overflow-hidden">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
} 