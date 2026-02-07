let cachedClient: any = null;

function getMockClient() {
  const mockAuth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Auth not configured' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  };
  return {
    auth: mockAuth,
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ limit: async () => ({ data: [], error: null }) }),
        }),
        order: () => ({ limit: async () => ({ data: [], error: null }) }),
      }),
    }),
  } as any;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return getMockClient();
  }

  if (cachedClient) return cachedClient;

  try {
    // Dynamic require to avoid crash if package has issues
    const { createBrowserClient } = require('@supabase/ssr');
    cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return cachedClient;
  } catch (e) {
    console.warn('Failed to create Supabase client:', e);
    return getMockClient();
  }
}
