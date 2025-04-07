import { ReactNode } from "react";
import { Providers } from "@/app/providers";

interface TextLayoutProps {
  children: ReactNode;
}

export default function TextLayout({ children }: TextLayoutProps) {
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