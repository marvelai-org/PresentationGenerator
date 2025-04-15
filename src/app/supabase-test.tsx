'use client';

import { useEffect, useState } from 'react';

import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

export default function SupabaseTest() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    isMockClient: boolean;
    error: string | null;
    tables: {
      name: string;
      count: number;
    }[];
  }>({
    isConnected: false,
    isMockClient: false,
    error: null,
    tables: [],
  });

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('Testing Supabase connection...');
        const supabase = createClientSupabaseClient();

        // Check if it's a mock client
        const isMockClient = !!(supabase as any).__isMockClient;

        console.log('Is mock client:', isMockClient);

        // Try to get data from tables to verify connection
        const tables = ['presentations', 'slides', 'users'];
        const tablesInfo = [];

        for (const table of tables) {
          try {
            const { data, error } = await supabase.from(table).select();

            if (error) throw error;
            console.log(`Table ${table}:`, data);
            tablesInfo.push({
              name: table,
              count: data?.length || 0,
            });
          } catch (err) {
            console.error(`Error accessing table ${table}:`, err);
            tablesInfo.push({
              name: table,
              count: -1, // Error indicator
            });
          }
        }

        setStatus({
          isConnected: true,
          isMockClient,
          error: null,
          tables: tablesInfo,
        });
      } catch (err) {
        console.error('Error testing Supabase connection:', err);
        setStatus({
          isConnected: false,
          isMockClient: true,
          error: err instanceof Error ? err.message : 'Unknown error',
          tables: [],
        });
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

      {status.isConnected ? (
        <div className="p-4 border rounded bg-green-50">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            Connection Status:
            <span className={status.isMockClient ? 'text-yellow-600' : 'text-green-600'}>
              {status.isMockClient ? ' MOCK CLIENT' : ' REAL CONNECTION'}
            </span>
          </h2>

          <h3 className="text-lg font-semibold mt-4 mb-2">Database Tables:</h3>
          <ul className="space-y-2">
            {status.tables.map(table => (
              <li key={table.name} className="flex">
                <span className="font-mono mr-2">{table.name}:</span>
                <span className={table.count >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {table.count >= 0 ? `${table.count} records` : '❌ Error accessing table'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 border rounded bg-red-50">
          <h2 className="text-xl font-semibold mb-2 text-red-700">Connection Failed</h2>
          {status.error && <p className="text-red-600">Error: {status.error}</p>}
        </div>
      )}

      <div className="mt-6">
        <p className="text-gray-600">Check your browser console for detailed connection logs.</p>
      </div>
    </div>
  );
}
