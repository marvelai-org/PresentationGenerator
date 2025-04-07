import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface CreateLayoutProps {
  children: ReactNode;
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  // This layout has no sidebar, navbar, or user profile at the bottom right
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
