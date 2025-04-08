import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface ImportLayoutProps {
  children: ReactNode;
}

export default function ImportLayout({ children }: ImportLayoutProps) {
  // This layout has no sidebar, navbar, or user profile
  return (
    <html className="dark" lang="en">
      <body className="bg-background">
        <Providers>
          <div className="min-h-screen w-full overflow-auto">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
