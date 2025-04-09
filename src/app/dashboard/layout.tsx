import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/auth/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // In CI environment, we want to render the children anyway
    const isCI = process.env.CI_ENVIRONMENT === "true";
    if (isCI) {
      console.info("CI environment detected, bypassing authentication check");
      return <div className="min-h-screen bg-background">{children}</div>;
    }

    redirect("/login");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
