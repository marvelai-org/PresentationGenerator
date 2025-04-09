import { createClientComponentClient as supabaseCreateClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import {
  getMockData,
  getRecords,
  insertRecords,
  updateRecords,
  deleteRecords,
  resetMockData,
} from "../storage/mock-storage";

/**
 * Comprehensive mock client implementation
 * Provides both authentication and database functionality
 */
const createMockClient = () => {
  const debugMode = process.env.NEXT_PUBLIC_MOCK_DEBUG === "true";

  // Log when mock client is used
  console.warn(
    "🛑 Using mock Supabase client - database and authentication functionality will be limited",
  );
  console.info(
    "💡 To use a real Supabase instance, add your credentials to .env.local",
  );

  /**
   * Helper function for debug logging mock operations
   */
  const logOperation = (operation: string, ...args: any[]) => {
    if (debugMode) {
      console.log(`🔍 Mock DB ${operation}:`, ...args);
    }
  };

  /**
   * Create a PostgrestFilterBuilder for mock filtering operations
   * This matches Supabase's filter chain pattern
   */
  const createFilterBuilder = (table: string, initialData: any[] = []) => {
    let filteredData = [...initialData];
    let query = { table, filters: [] as any[] };

    const builder = {
      // Basic filter operations
      eq: (column: string, value: any) => {
        logOperation("filter:eq", column, value);
        query.filters.push({ type: "eq", column, value });
        filteredData = filteredData.filter((item) => item[column] === value);
        return builder;
      },
      neq: (column: string, value: any) => {
        logOperation("filter:neq", column, value);
        query.filters.push({ type: "neq", column, value });
        filteredData = filteredData.filter((item) => item[column] !== value);
        return builder;
      },
      gt: (column: string, value: any) => {
        logOperation("filter:gt", column, value);
        query.filters.push({ type: "gt", column, value });
        filteredData = filteredData.filter((item) => item[column] > value);
        return builder;
      },
      gte: (column: string, value: any) => {
        logOperation("filter:gte", column, value);
        query.filters.push({ type: "gte", column, value });
        filteredData = filteredData.filter((item) => item[column] >= value);
        return builder;
      },
      lt: (column: string, value: any) => {
        logOperation("filter:lt", column, value);
        query.filters.push({ type: "lt", column, value });
        filteredData = filteredData.filter((item) => item[column] < value);
        return builder;
      },
      lte: (column: string, value: any) => {
        logOperation("filter:lte", column, value);
        query.filters.push({ type: "lte", column, value });
        filteredData = filteredData.filter((item) => item[column] <= value);
        return builder;
      },
      like: (column: string, pattern: string) => {
        logOperation("filter:like", column, pattern);
        query.filters.push({ type: "like", column, pattern });
        // Convert SQL LIKE pattern to JS regex
        const regexPattern = pattern.replace(/%/g, ".*").replace(/_/g, ".");
        const regex = new RegExp(`^${regexPattern}$`, "i");
        filteredData = filteredData.filter((item) =>
          regex.test(String(item[column])),
        );
        return builder;
      },
      ilike: (column: string, pattern: string) => {
        return builder.like(column, pattern); // Case insensitive by default in our implementation
      },
      is: (column: string, value: any) => {
        logOperation("filter:is", column, value);
        query.filters.push({ type: "is", column, value });
        // Handle null special case
        if (value === null) {
          filteredData = filteredData.filter((item) => item[column] === null);
        } else {
          filteredData = filteredData.filter((item) => item[column] === value);
        }
        return builder;
      },
      in: (column: string, values: any[]) => {
        logOperation("filter:in", column, values);
        query.filters.push({ type: "in", column, values });
        filteredData = filteredData.filter((item) =>
          values.includes(item[column]),
        );
        return builder;
      },

      // Order operations
      order: (column: string, options: { ascending?: boolean } = {}) => {
        const ascending = options.ascending !== false;
        logOperation("order", column, ascending ? "asc" : "desc");

        // Create a sort function
        filteredData.sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];

          // Handle nulls
          if (aVal === null && bVal === null) return 0;
          if (aVal === null) return ascending ? -1 : 1;
          if (bVal === null) return ascending ? 1 : -1;

          // Normal comparison
          if (aVal < bVal) return ascending ? -1 : 1;
          if (aVal > bVal) return ascending ? 1 : -1;
          return 0;
        });

        return {
          ...builder,
          limit: (count: number) => {
            logOperation("limit", count);
            filteredData = filteredData.slice(0, count);
            return Promise.resolve({ data: filteredData, error: null });
          },
        };
      },

      // Range operations
      range: (from: number, to: number) => {
        logOperation("range", from, to);
        filteredData = filteredData.slice(from, to + 1); // Inclusive range
        return builder;
      },

      // Limit operation
      limit: (count: number) => {
        logOperation("limit", count);
        filteredData = filteredData.slice(0, count);
        return builder;
      },

      // Execution operations
      single: () => {
        logOperation("single", query);
        const result = filteredData.length > 0 ? filteredData[0] : null;
        return Promise.resolve({ data: result, error: null });
      },

      // Direct execution without additional modifiers
      then: (onfulfilled: (value: { data: any; error: null }) => any) => {
        return Promise.resolve({ data: filteredData, error: null }).then(
          onfulfilled,
        );
      },
    };

    // Make the object awaitable directly
    Object.defineProperty(builder, "then", {
      enumerable: false,
      value: (onfulfilled: (value: { data: any; error: null }) => any) => {
        return Promise.resolve({ data: filteredData, error: null }).then(
          onfulfilled,
        );
      },
    });

    return builder;
  };

  /**
   * Main client object with auth and database operations
   */
  return {
    // Authentication methods
    auth: {
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: null,
        error: {
          message: "Mock client - authentication disabled in this environment",
        },
      }),
      signInWithOtp: async () => ({
        data: null,
        error: null,
      }),
      signUp: async () => ({
        data: { user: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({
        data: { user: null },
        error: null,
      }),
      resetPasswordForEmail: async () => ({
        data: {},
        error: null,
      }),
      onAuthStateChange: (callback: any) => {
        // Immediately trigger with null session to simulate logged out state
        callback("SIGNED_OUT", { session: null });

        // Return unsubscribe function
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      },
      signInWithOAuth: async () => ({
        data: null,
        error: null,
      }),
    },

    // Database methods
    from: (table: string) => {
      logOperation("from", table);
      const tableData = getRecords(table);

      return {
        // Select operation
        select: (columns?: string | string[]) => {
          logOperation("select", columns);
          let selectedData = [...tableData];

          // Handle column selection (simplified implementation)
          if (columns) {
            const columnList =
              typeof columns === "string"
                ? columns.split(",").map((c) => c.trim())
                : columns;

            selectedData = selectedData.map((item) => {
              const result: any = {};
              columnList.forEach((col) => {
                result[col] = item[col];
              });
              return result;
            });
          }

          return createFilterBuilder(table, selectedData);
        },

        // Insert operation
        insert: (data: any | any[]) => {
          logOperation("insert", data);
          const result = insertRecords(table, data);

          // Make the results awaitable
          const promise = Promise.resolve(result);

          // Add select method to allow chaining
          const enhanced = promise as any;
          enhanced.select = () =>
            createFilterBuilder(
              table,
              result.data ? [].concat(result.data) : [],
            );

          return enhanced;
        },

        // Update operation
        update: (updates: any) => {
          logOperation("update", updates);

          return {
            eq: (column: string, value: any) => {
              logOperation("update.eq", column, value);
              return Promise.resolve(
                updateRecords(table, updates, column, value),
              );
            },
            match: (criteria: Record<string, any>) => {
              logOperation("update.match", criteria);

              // Get all records
              const allRecords = getRecords(table);

              // Filter by criteria
              const recordsToUpdate = allRecords.filter((record) => {
                return Object.entries(criteria).every(
                  ([key, value]) => record[key] === value,
                );
              });

              if (recordsToUpdate.length === 0) {
                return Promise.resolve({ data: [], error: null });
              }

              // Update the first matching record
              const column = Object.keys(criteria)[0];
              const value = criteria[column];

              return Promise.resolve(
                updateRecords(table, updates, column, value),
              );
            },
          };
        },

        // Delete operation
        delete: () => {
          logOperation("delete");

          return {
            eq: (column: string, value: any) => {
              logOperation("delete.eq", column, value);
              return Promise.resolve(deleteRecords(table, column, value));
            },
            match: (criteria: Record<string, any>) => {
              logOperation("delete.match", criteria);

              // If criteria is empty, do nothing for safety
              if (Object.keys(criteria).length === 0) {
                return Promise.resolve({ data: { count: 0 }, error: null });
              }

              // Use the first criterion for simplicity
              const column = Object.keys(criteria)[0];
              const value = criteria[column];

              return Promise.resolve(deleteRecords(table, column, value));
            },
          };
        },

        // RPC function simulation
        rpc: (fn: string, params: any) => {
          logOperation("rpc", fn, params);
          return Promise.resolve({
            data: null,
            error: new Error("RPC functions not implemented in mock client"),
          });
        },
      };
    },

    // Storage operations (basic mock implementation)
    storage: {
      from: (bucket: string) => {
        logOperation("storage.from", bucket);

        return {
          upload: async (path: string, file: any) => {
            logOperation("storage.upload", path, file?.name || "file");
            return {
              data: { path: `${bucket}/${path}` },
              error: null,
            };
          },
          download: async (path: string) => {
            logOperation("storage.download", path);
            return {
              data: null,
              error: new Error(
                "Storage download not implemented in mock client",
              ),
            };
          },
          getPublicUrl: (path: string) => {
            logOperation("storage.getPublicUrl", path);
            return {
              publicUrl: `https://mock-storage.example.com/${bucket}/${path}`,
            };
          },
          list: async (prefix?: string) => {
            logOperation("storage.list", prefix);
            return { data: [], error: null };
          },
          remove: async (paths: string | string[]) => {
            logOperation("storage.remove", paths);
            return {
              data: { count: Array.isArray(paths) ? paths.length : 1 },
              error: null,
            };
          },
        };
      },
    },

    // Reset all mock data (useful for testing)
    resetMockData: () => {
      logOperation("resetMockData");
      resetMockData();
    },
  };
};

// Check if we should use mock client
const shouldUseMockClient = () => {
  // We're in a browser context
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // For local dev, only use mock if env vars are missing
    if (isLocalhost) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      return !supabaseUrl || !supabaseKey;
    }
  }

  // For CI or undefined window (SSR)
  const isCI = process.env.CI_ENVIRONMENT === "true";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return isCI || !supabaseUrl || !supabaseKey;
};

/**
 * Creates a Supabase client for Client Components
 *
 * This function is safe to use in client components and will
 * automatically use a mock implementation in CI environments
 * or when credentials are missing.
 */
export function createClientSupabaseClient() {
  try {
    // Check if we should use mock client based on environment
    if (shouldUseMockClient()) {
      // Enable debugging in local development
      if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1")
      ) {
        const isMockDebug = process.env.NEXT_PUBLIC_MOCK_DEBUG === "true";
        if (isMockDebug) {
          console.log("👨‍💻 Using mock client in dev environment");
        }
      }

      console.info(
        process.env.CI_ENVIRONMENT === "true"
          ? "🔶 Using mock client in CI environment"
          : "⚠️ Missing Supabase credentials, using mock client",
      );

      // Use unknown as an intermediate step in the type cast to avoid TypeScript errors
      return createMockClient() as unknown as ReturnType<
        typeof supabaseCreateClientComponentClient<Database>
      >;
    }

    return supabaseCreateClientComponentClient<Database>();
  } catch (error) {
    console.warn("⚠️ Supabase client creation error:", error);
    // Use unknown as an intermediate step in the type cast to avoid TypeScript errors
    return createMockClient() as unknown as ReturnType<
      typeof supabaseCreateClientComponentClient<Database>
    >;
  }
}

// For backward compatibility - will be deprecated
export function createClientComponentClient(options?: any) {
  console.warn(
    "⚠️ createClientComponentClient is deprecated, please use createClientSupabaseClient instead",
  );
  return createClientSupabaseClient();
}
