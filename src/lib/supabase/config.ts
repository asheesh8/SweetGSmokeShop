/**
 * Supabase is optional.
 *
 * The site shipped with a static catalogue and has to keep rendering whether or
 * not a database is attached — during local work, in preview builds, and in the
 * window before the shop's project is wired up. Every Supabase call site checks
 * this first and falls back to the static seed, so "no database yet" is a
 * supported state rather than a crash.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const IMAGE_BUCKET = 'product-images'

/** Public URL for a path inside the product-images bucket. */
export function storageUrl(path: string | null | undefined): string | null {
  if (!path || !supabaseConfigured) return null
  if (path.startsWith('http')) return path
  return `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`
}
