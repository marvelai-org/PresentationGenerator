import Link from 'next/link';

export default function DebugPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Tools</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Supabase Debugging</h2>
          <div className="space-y-2">
            <div>
              <Link className="text-blue-600 hover:underline" href="/debug/supabase-test">
                Supabase Connection Test
              </Link>
              <p className="text-sm text-gray-600">
                Simple test to verify Supabase connection and data access
              </p>
            </div>

            <div>
              <Link className="text-blue-600 hover:underline" href="/debug/supabase-debug">
                Supabase Debug Console
              </Link>
              <p className="text-sm text-gray-600">
                Advanced debugging for Supabase client with environment variables and mock mode
                toggle
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Theme Testing</h2>
          <Link className="text-blue-600 hover:underline" href="/theme-test">
            Theme Tester
          </Link>
          <p className="text-sm text-gray-600">Test and preview different theme settings</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-500">
          Note: These debug tools are for development purposes only and should not be accessible in
          production.
        </p>
      </div>
    </div>
  );
}
