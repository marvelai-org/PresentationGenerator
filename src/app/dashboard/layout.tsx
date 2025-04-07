import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";

// Define sidebar items
const sidebarItems = [
  {
    key: "dashboard",
    title: "Dashboard",
    icon: "material-symbols:dashboard",
    href: "/dashboard",
  },
  {
    key: "presentations",
    title: "Presentations",
    icon: "material-symbols:slideshow",
    href: "/dashboard/presentations",
  },
  {
    key: "templates",
    title: "Templates",
    icon: "material-symbols:template",
    href: "/dashboard/templates",
  },
  {
    key: "settings",
    title: "Settings",
    icon: "material-symbols:settings",
    href: "/dashboard/settings",
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:flex h-full">
        <Sidebar
          className="w-64 h-full border-r border-divider"
          defaultSelectedKey="dashboard"
          items={sidebarItems}
        />
      </div>
      <div className="flex-1 flex flex-col h-full overflow-auto">
        <div className="flex justify-end items-center p-4 border-b border-divider">
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <div className="flex items-center gap-2">
              <span className="text-sm hidden md:block">{user.email}</span>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
