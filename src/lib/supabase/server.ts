import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from './config'

/**
 * Server client for Server Components, Server Actions and route handlers.
 *
 * The `setAll` swallow is deliberate and is the documented pattern: Server
 * Components can't mutate cookies, so a refresh attempted during render throws.
 * The middleware refreshes the session on every request, so dropping the write
 * here is safe — the cookie has already been updated upstream.
 */
export async function createClient() {
  if (!supabaseConfigured) return null

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component — middleware owns the refresh.
        }
      },
    },
  })
}

/**
 * The signed-in staff member, or null.
 *
 * Being authenticated is not the same as being staff: anyone could sign up.
 * Authorisation is membership in the `staff` table, which is also what the RLS
 * policies key off, so the UI and the database agree on who can write.
 */
export async function getStaffUser() {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data } = await supabase
    .from('staff')
    .select('email, name')
    .ilike('email', user.email)
    .maybeSingle()

  return data ? { email: user.email, name: data.name as string | null, id: user.id } : null
}
