/**
 * Mock storage implementation for Supabase database operations
 * Provides persistence options for browser and server environments
 */

// Basic table structure based on our database schema
export interface MockDatabase {
  presentations: any[];
  slides: any[];
  users: any[];
  [key: string]: any[]; // Allow dynamic table access
}

// Initial seed data for the mock database
const initialData: MockDatabase = {
  presentations: [
    {
      id: '1',
      title: 'Sample Presentation',
      description: 'A sample presentation for testing',
      user_id: 'mock-user-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: true,
      thumbnail_url: null,
    },
  ],
  slides: [
    {
      id: '1',
      presentation_id: '1',
      content: 'Sample slide content',
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: 'mock-user-1',
      email: 'user@example.com',
      name: 'Test User',
      created_at: new Date().toISOString(),
    },
  ],
};

// In-memory fallback when localStorage is not available
let memoryStorage: MockDatabase = JSON.parse(JSON.stringify(initialData));

/**
 * Gets the mock database from storage
 * Uses localStorage in browser environments, memory storage in server
 */
export function getMockData(): MockDatabase {
  if (typeof window !== 'undefined') {
    try {
      const storedData = localStorage.getItem('supabase_mock_db');

      if (storedData) {
        return JSON.parse(storedData);
      } else {
        // Initialize with seed data if not exists
        localStorage.setItem('supabase_mock_db', JSON.stringify(initialData));

        return JSON.parse(JSON.stringify(initialData));
      }
    } catch (e) {
      // Fallback to memory storage if localStorage fails
      console.warn('Failed to access localStorage, using in-memory storage:', e);

      return memoryStorage;
    }
  } else {
    // Server-side execution, use memory storage
    return memoryStorage;
  }
}

/**
 * Updates the mock database in storage
 * @param data The new data to persist
 */
export function updateMockData(data: MockDatabase): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('supabase_mock_db', JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to update localStorage, updating in-memory only:', e);
    }
  }

  // Always update memory storage (used for SSR)
  memoryStorage = JSON.parse(JSON.stringify(data));
}

/**
 * Resets the mock database to initial seed data
 */
export function resetMockData(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('supabase_mock_db', JSON.stringify(initialData));
    } catch (e) {
      console.warn('Failed to reset localStorage:', e);
    }
  }

  memoryStorage = JSON.parse(JSON.stringify(initialData));
}

/**
 * Gets records from a table with optional filtering
 * @param table The table name to query
 * @param column Optional column to filter on
 * @param value Optional value to filter by
 */
export function getRecords(table: string, column?: string, value?: any): any[] {
  const db = getMockData();
  const tableData = db[table] || [];

  if (!column || value === undefined) {
    return [...tableData];
  }

  // Basic filtering implementation
  return tableData.filter(record => record[column] === value);
}

/**
 * Inserts records into a table
 * @param table The table name
 * @param data The data to insert (array or single object)
 */
export function insertRecords(
  table: string,
  data: any | any[]
): { data: any | any[] | null; error: any } {
  try {
    const db = getMockData();

    // Ensure table exists
    if (!db[table]) {
      db[table] = [];
    }

    const isArray = Array.isArray(data);
    const recordsToInsert = isArray ? data : [data];

    // Process records to add ids if missing
    const processedRecords = recordsToInsert.map(record => {
      // Add timestamp fields if they don't exist
      const now = new Date().toISOString();
      const newRecord = {
        ...record,
        id:
          record.id || `mock-${table}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        created_at: record.created_at || now,
        updated_at: now,
      };

      return newRecord;
    });

    // Add to table
    db[table] = [...db[table], ...processedRecords];

    // Persist changes
    updateMockData(db);

    return {
      data: isArray ? processedRecords : processedRecords[0],
      error: null,
    };
  } catch (error) {
    console.error('Mock DB insertion error:', error);

    return { data: null, error };
  }
}

/**
 * Updates records in a table
 * @param table The table name
 * @param updates The updates to apply
 * @param column The column to filter on
 * @param value The value to filter by
 */
export function updateRecords(
  table: string,
  updates: any,
  column: string,
  value: any
): { data: any[] | null; error: any } {
  try {
    const db = getMockData();

    if (!db[table]) {
      return {
        data: null,
        error: new Error(`Table '${table}' does not exist`),
      };
    }

    const now = new Date().toISOString();
    let updatedRecords: any[] = [];

    // Update matching records
    db[table] = db[table].map(record => {
      if (record[column] === value) {
        const updatedRecord = {
          ...record,
          ...updates,
          updated_at: now,
        };

        updatedRecords.push(updatedRecord);

        return updatedRecord;
      }

      return record;
    });

    // Persist changes
    updateMockData(db);

    return { data: updatedRecords, error: null };
  } catch (error) {
    console.error('Mock DB update error:', error);

    return { data: null, error };
  }
}

/**
 * Deletes records from a table
 * @param table The table name
 * @param column The column to filter on
 * @param value The value to filter by
 */
export function deleteRecords(
  table: string,
  column: string,
  value: any
): { data: any; error: any } {
  try {
    const db = getMockData();

    if (!db[table]) {
      return {
        data: null,
        error: new Error(`Table '${table}' does not exist`),
      };
    }

    // Store original count to report how many were deleted
    const originalCount = db[table].length;

    // Filter out matching records
    db[table] = db[table].filter(record => record[column] !== value);

    // Persist changes
    updateMockData(db);

    const deletedCount = originalCount - db[table].length;

    return {
      data: { count: deletedCount },
      error: null,
    };
  } catch (error) {
    console.error('Mock DB deletion error:', error);

    return { data: null, error };
  }
}
