// src/app/(dashboard)/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

// Use more conventional config
// Remove force-dynamic and use a simpler approach
export const dynamic = "error";
export const revalidate = false;
