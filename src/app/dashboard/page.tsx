"use client";

import React from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Define User interface
interface User {
  id: string;
  email: string;
  // Add any other properties your user might have
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user as User);
      setLoading(false);

      if (!user) {
        router.push("/login");
      }
    }

    getUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button color="primary" variant="flat" onPress={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user?.email || "User"}!
          </h2>
          <p className="mt-2 text-gray-600">
            Your user ID: {user?.id || "Unknown"}
          </p>
        </div>

        <div className="mt-8 rounded-md bg-gray-50 p-4">
          <h3 className="text-lg font-medium">What&apos;s Next?</h3>
          <p className="mt-2 text-gray-600">
            This is your dashboard. You can start building your application by
            adding components and features to this page.
          </p>
        </div>
      </div>
    </div>
  );
}
