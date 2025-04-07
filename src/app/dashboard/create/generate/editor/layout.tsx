import { ReactNode } from "react";

import { Providers } from "@/app/providers";

interface EditorLayoutProps {
  children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  // This layout has no sidebar or navbar, just the content
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
