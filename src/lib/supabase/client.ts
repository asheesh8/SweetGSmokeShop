'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from './config'

/**
 * Browser client, for the admin UI's interactive bits (uploads, live edits).
 *
 * Returns null rather than throwing when Supabase isn't configured — callers
 * render a "connect Supabase" state instead of a stack trace.
 */
export function createClient() {
  if (!supabaseConfigured) return null
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
