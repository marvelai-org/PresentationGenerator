// src/types/supabase.ts
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          email: string;
          name?: string | null;
        };
        Update: {
          email?: string;
          name?: string | null;
        };
      };
      // Add other tables as needed
    };
  };
};
