import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export interface StorageAdapter extends StateStorage {
  name: string;
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// Local Storage Adapter
export class LocalStorageAdapter implements StorageAdapter {
  name = 'localStorage';

  getItem(name: string) {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  setItem(name: string, value: string) {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  removeItem(name: string) {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
}

// IndexedDB Adapter (simplified version)
export class IndexedDBAdapter implements StorageAdapter {
  name = 'indexedDB';
  private dbName: string;
  private storeName: string;

  constructor(dbName = 'presentationStore', storeName = 'state') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async getItem(name: string): Promise<string | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(name);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (error) {
      console.error('Error reading from IndexedDB:', error);
      return null;
    }
  }

  async setItem(name: string, value: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, name);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error writing to IndexedDB:', error);
    }
  }

  async removeItem(name: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(name);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error removing from IndexedDB:', error);
    }
  }
}

// Supabase Adapter
export class SupabaseAdapter implements StorageAdapter {
  name = 'supabase';
  private tableName: string;
  private userId: string | null = null;

  constructor(tableName = 'presentation_store') {
    this.tableName = tableName;
    // Initialize user ID if available
    this.initializeUser();
  }

  private async initializeUser() {
    try {
      const supabase = createClientSupabaseClient();
      const { data } = await supabase.auth.getUser();
      this.userId = data.user?.id || null;
    } catch (error) {
      console.error('Error initializing Supabase user:', error);
    }
  }

  async getItem(name: string): Promise<string | null> {
    try {
      // Return null if user is not logged in
      if (!this.userId) {
        console.warn('Cannot fetch from Supabase: No user logged in');
        return null;
      }

      const supabase = createClientSupabaseClient();
      const { data, error } = await supabase
        .from(this.tableName)
        .select('value')
        .eq('name', name)
        .eq('user_id', this.userId)
        .single();

      if (error) {
        console.error('Error fetching from Supabase:', error);
        return null;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error reading from Supabase:', error);
      return null;
    }
  }

  async setItem(name: string, value: string): Promise<void> {
    try {
      // Skip if user is not logged in
      if (!this.userId) {
        console.warn('Cannot save to Supabase: No user logged in');
        return;
      }

      const supabase = createClientSupabaseClient();
      
      // Attempt upsert (update or insert)
      const { error } = await supabase
        .from(this.tableName)
        .upsert(
          {
            name,
            value,
            user_id: this.userId,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'name,user_id' }
        );

      if (error) {
        console.error('Error saving to Supabase:', error);
      }
    } catch (error) {
      console.error('Error writing to Supabase:', error);
    }
  }

  async removeItem(name: string): Promise<void> {
    try {
      // Skip if user is not logged in
      if (!this.userId) {
        console.warn('Cannot delete from Supabase: No user logged in');
        return;
      }

      const supabase = createClientSupabaseClient();
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('name', name)
        .eq('user_id', this.userId);

      if (error) {
        console.error('Error deleting from Supabase:', error);
      }
    } catch (error) {
      console.error('Error removing from Supabase:', error);
    }
  }
}

// Multi-layered storage adapter that tries multiple storage methods
export class MultiStorageAdapter implements StorageAdapter {
  name = 'multi';
  private adapters: StorageAdapter[];
  
  constructor(adapters: StorageAdapter[] = [new LocalStorageAdapter()]) {
    this.adapters = adapters;
  }

  // Try to get from first available adapter that has the item
  async getItem(name: string): Promise<string | null> {
    for (const adapter of this.adapters) {
      try {
        const value = await adapter.getItem(name);
        if (value !== null) {
          return value;
        }
      } catch (error) {
        console.warn(`Error reading from ${adapter.name}:`, error);
      }
    }
    return null;
  }

  // Set to all adapters
  async setItem(name: string, value: string): Promise<void> {
    const errors: Error[] = [];

    await Promise.all(
      this.adapters.map(async (adapter) => {
        try {
          await adapter.setItem(name, value);
        } catch (error) {
          errors.push(error as Error);
          console.error(`Error writing to ${adapter.name}:`, error);
        }
      })
    );

    if (errors.length === this.adapters.length) {
      throw new Error('Failed to write to any storage adapter');
    }
  }

  // Remove from all adapters
  async removeItem(name: string): Promise<void> {
    await Promise.all(
      this.adapters.map(async (adapter) => {
        try {
          await adapter.removeItem(name);
        } catch (error) {
          console.error(`Error removing from ${adapter.name}:`, error);
        }
      })
    );
  }
}

// Factory function to create a persistence middleware with a specific adapter
export function createPersistMiddleware<T>(
  options: {
    name: string;
    partialize?: (state: T) => object;
    adapter?: StorageAdapter | 'localStorage' | 'indexedDB' | 'supabase' | 'multi';
    version?: number;
  }
) {
  let adapter: StorageAdapter;

  // Create the appropriate adapter
  switch (options.adapter) {
    case 'localStorage':
      adapter = new LocalStorageAdapter();
      break;
    case 'indexedDB':
      adapter = new IndexedDBAdapter();
      break;
    case 'supabase':
      adapter = new SupabaseAdapter();
      break;
    case 'multi':
      adapter = new MultiStorageAdapter([
        new LocalStorageAdapter(),
        new IndexedDBAdapter(),
        new SupabaseAdapter()
      ]);
      break;
    default:
      adapter = options.adapter || new LocalStorageAdapter();
  }

  // Create the storage object for Zustand persist
  const storage = createJSONStorage(() => adapter);

  // Return the persist middleware
  return persist<T>(
    (set, get, api) => {
      // Return an empty object that will be filled with the actual state during rehydration
      return {} as unknown as T;
    },
    {
      name: options.name,
      storage,
      partialize: options.partialize,
      version: options.version,
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating store:', error);
          } else {
            console.log('Store rehydrated successfully');
          }
        };
      }
    }
  );
} 