/**
 * Catalogue shapes and formatting — client-safe.
 *
 * Deliberately separate from `inventory.ts`. That module imports the Supabase
 * server client, which imports `next/headers`, which cannot be bundled for the
 * browser. Client components need these types and `formatPrice`, so they live
 * here where importing them drags nothing server-only along.
 */

export type Variant = {
  id: string
  name: string
  priceCents: number | null
  inStock: boolean
}

export type Item = {
  id: string
  slug: string
  name: string
  categorySlug: string
  brand: string | null
  hook: string
  body: string
  details: string[]
  priceCents: number | null
  inStock: boolean
  rotates: boolean
  featured: boolean
  /** Fully resolved: Supabase Storage URL, or the bundled /products/<slug>.jpg. */
  imageUrl: string | null
  variants: Variant[]
}

export type Cat = { slug: string; name: string; blurb: string }

export type Announcement = { id: string; body: string } | null

export type Inventory = {
  items: Item[]
  categories: Cat[]
  announcement: Announcement
  /** True when the data came from Supabase; the admin surfaces this. */
  live: boolean
}

/** Money in, string out. A null price means "ask in store", not free. */
export function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return 'Ask in store'
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}
