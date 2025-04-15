'use client';

import { useEffect, useState } from 'react';

import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

export default function SupabaseDebug() {
  const [clientInfo, setClientInfo] = useState<{
    isMockClient: boolean;
    envVars: {
      NEXT_PUBLIC_SUPABASE_URL: string | null;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string | null;
      CI_ENVIRONMENT: string | null;
      NEXT_PUBLIC_MOCK_DEBUG: string | null;
    };
    tables: {
      name: string;
      count: number;
    }[];
  } | null>(null);

  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    async function checkClient() {
      try {
        // Set debug mode based on state
        if (typeof window !== 'undefined') {
          (window as any).__FORCE_MOCK_DEBUG = debugMode;
        }

        const supabase = createClientSupabaseClient();

        // Check if it's a mock client
        const isMockClient = !!(supabase as any).__isMockClient;

        // Get environment variables (safely)
        const envVars = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? '***' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substr(-5)
            : null,
          CI_ENVIRONMENT: process.env.CI_ENVIRONMENT || null,
          NEXT_PUBLIC_MOCK_DEBUG: process.env.NEXT_PUBLIC_MOCK_DEBUG || null,
        };

        // Try to get data from tables to verify connection
        const tables = ['presentations', 'slides', 'users'];
        const tablesInfo = [];

        for (const table of tables) {
          try {
            const { data, error } = await supabase.from(table).select();

            if (error) throw error;
            tablesInfo.push({
              name: table,
              count: data?.length || 0,
            });
          } catch (err) {
            tablesInfo.push({
              name: table,
              count: -1, // Error indicator
            });
          }
        }

        setClientInfo({
          isMockClient,
          envVars,
          tables: tablesInfo,
        });
      } catch (err) {
        console.error('Error checking Supabase client:', err);
      }
    }

    checkClient();
  }, [debugMode]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Client Debug</h1>

      <div className="mb-4">
        <button
          className={`px-4 py-2 rounded font-medium ${
            debugMode ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setDebugMode(!debugMode)}
        >
          {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
        </button>
        {debugMode && (
          <p className="mt-2 text-sm text-red-600">
            Debug mode is enabled. This forces the app to use mock data for testing.
          </p>
        )}
      </div>

      {!clientInfo ? (
        <p>Loading client information...</p>
      ) : (
        <div className="space-y-6">
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Client Type</h2>
            <p className={clientInfo.isMockClient ? 'text-yellow-600' : 'text-green-600'}>
              {clientInfo.isMockClient
                ? '🔶 Using MOCK Supabase client'
                : '✅ Using REAL Supabase client'}
            </p>
          </div>

          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
            <ul className="space-y-2">
              {Object.entries(clientInfo.envVars).map(([key, value]) => (
                <li key={key} className="flex">
                  <span className="font-mono mr-2">{key}:</span>
                  <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value || '❌ Not set'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-2">Database Tables</h2>
            <ul className="space-y-2">
              {clientInfo.tables.map(table => (
                <li key={table.name} className="flex">
                  <span className="font-mono mr-2">{table.name}:</span>
                  <span>
                    {table.count >= 0 ? `${table.count} records` : '❌ Error accessing table'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
