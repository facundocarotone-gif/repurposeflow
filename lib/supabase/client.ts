import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client for build time
    if (typeof window === 'undefined') {
      return null as unknown as ReturnType<typeof createBrowserClient>;
    }
    throw new Error('Supabase environment variables are not configured');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
