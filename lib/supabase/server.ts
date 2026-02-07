import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured');
    // Return a mock client so pages can still render
    const mockAuth = {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    };
    const mockFrom = () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
    });
    return { auth: mockAuth, from: mockFrom } as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component, ignore
          }
        },
      },
    }
  );
}
