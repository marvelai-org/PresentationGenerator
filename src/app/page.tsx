// src/app/page.tsx
export const dynamic = "force-static";
export const revalidate = false;

import LandingPage from "@/components/features/marketing/landing-page/LandingPage";

export default function HomePage() {
  return <LandingPage />;
}
