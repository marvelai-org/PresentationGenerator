import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface PresentLayoutProps {
  children: ReactNode;
}

export default function PresentLayout({ children }: PresentLayoutProps) {
  // Pure fullscreen presentation with no UI elements
  return (
    <html className="dark" lang="en">
      <body className="bg-black">
        <Providers>
          <div className="h-screen w-screen overflow-hidden">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
