import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Aseguramos variables en build phase (aunque para el login real requerirá en local)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key'

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
