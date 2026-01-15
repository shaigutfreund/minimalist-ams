import { createBrowserClient } from '@supabase/ssr'


let supabase: ReturnType<typeof createBrowserClient>;

if (!supabase) {
  supabase = createClient()
}

export { supabase };

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        }
    )
}


