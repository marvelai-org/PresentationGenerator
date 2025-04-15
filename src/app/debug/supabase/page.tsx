import SupabaseDebug from '@/app/supabase-debug';

export const metadata = {
  title: 'Supabase Debug',
  description: 'Debugging page for Supabase client implementation',
};

export default function SupabaseDebugPage() {
  return <SupabaseDebug />;
}
