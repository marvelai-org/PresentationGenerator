// src/app/page.tsx
export const dynamic = "force-static";
export const revalidate = false;

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}
