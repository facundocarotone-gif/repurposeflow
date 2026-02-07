import { createBrowserClient } from '@supabase/ssr';

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that won't crash the app
    // This handles both SSR build time and client-side when env vars are missing
    console.warn('Supabase environment variables are not configured');
    const mockAuth = {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    };
    return { auth: mockAuth, from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) }) } as unknown as ReturnType<typeof createBrowserClient>;
  }
  
  if (cachedClient) return cachedClient;
  cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
}
