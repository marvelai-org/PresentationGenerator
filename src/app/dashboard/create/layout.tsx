import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface CreateLayoutProps {
  children: ReactNode;
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  // This layout has no sidebar, navbar, or user profile at the bottom right
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
