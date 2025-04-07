import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface ImportLayoutProps {
  children: ReactNode;
}

export default function ImportLayout({ children }: ImportLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
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
