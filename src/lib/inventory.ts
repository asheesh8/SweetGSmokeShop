import { createClient } from '@/lib/supabase/server'
import { storageUrl, supabaseConfigured } from '@/lib/supabase/config'
import { CATEGORIES as SEED_CATEGORIES, PRODUCTS as SEED_PRODUCTS } from '@/lib/products'
import type { Cat, Inventory, Item, Variant } from '@/lib/catalog'

// Re-exported so server modules can keep importing shapes from one place.
export type { Cat, Inventory, Item, Variant }
export { formatPrice } from '@/lib/catalog'

/**
 * The shop's inventory, from Supabase when it's attached and from the static
 * seed when it isn't.
 *
 * Everything downstream — the store, the quick view, the product routes —
 * consumes these shapes, so switching the shop onto a real database changed no
 * component. It also means a broken or unreachable database degrades to the
 * seed catalogue instead of an empty shop.
 */


/** The static catalogue, shaped like live data. */
function seedInventory(): Inventory {
  return {
    live: false,
    announcement: null,
    categories: SEED_CATEGORIES.map((c) => ({ slug: c.slug, name: c.name, blurb: c.blurb })),
    items: SEED_PRODUCTS.map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      categorySlug: p.category,
      brand: p.brand ?? null,
      hook: p.hook,
      body: p.body,
      details: p.details,
      priceCents: null,
      inStock: true,
      rotates: Boolean(p.rotates),
      featured: false,
      imageUrl: `/products/${p.slug}.jpg`,
      variants: [],
    })),
  }
}

type Row = {
  id: string
  slug: string
  name: string
  brand: string | null
  hook: string | null
  body: string | null
  details: string[] | null
  price_cents: number | null
  in_stock: boolean
  rotates: boolean
  featured: boolean
  image_path: string | null
  categories: { slug: string } | null
  product_variants: {
    id: string
    name: string
    price_cents: number | null
    in_stock: boolean
    sort: number
  }[]
}

/**
 * Read the live catalogue.
 *
 * `published` filtering is enforced by RLS rather than repeated here, so the
 * policy is the single place that decides what the public can see.
 */
export async function getInventory(): Promise<Inventory> {
  if (!supabaseConfigured) return seedInventory()

  const supabase = await createClient()
  if (!supabase) return seedInventory()

  const [{ data: rows, error }, { data: cats }, { data: notes }] = await Promise.all([
    supabase
      .from('products')
      .select(
        'id, slug, name, brand, hook, body, details, price_cents, in_stock, rotates, featured, image_path, categories(slug), product_variants(id, name, price_cents, in_stock, sort)',
      )
      .order('sort', { ascending: true })
      .order('name', { ascending: true }),
    supabase.from('categories').select('slug, name, blurb').order('sort', { ascending: true }),
    supabase
      .from('announcements')
      .select('id, body')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  // An unreachable or misconfigured database should not empty the shop.
  if (error || !rows?.length) {
    if (error) console.error('[inventory] falling back to seed:', error.message)
    return seedInventory()
  }

  const items: Item[] = (rows as unknown as Row[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    categorySlug: r.categories?.slug ?? 'accessories',
    brand: r.brand,
    hook: r.hook ?? '',
    body: r.body ?? '',
    details: r.details ?? [],
    priceCents: r.price_cents,
    inStock: r.in_stock,
    rotates: r.rotates,
    featured: r.featured,
    // Storage first, then a bundled photo at the conventional path, then the
    // component's graded fallback plate.
    imageUrl: storageUrl(r.image_path) ?? `/products/${r.slug}.jpg`,
    variants: (r.product_variants ?? [])
      .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))
      .map((v) => ({
        id: v.id,
        name: v.name,
        priceCents: v.price_cents,
        inStock: v.in_stock,
      })),
  }))

  return {
    live: true,
    items,
    categories: (cats ?? []).map((c) => ({
      slug: c.slug as string,
      name: c.name as string,
      blurb: (c.blurb as string) ?? '',
    })),
    announcement: notes?.[0] ? { id: notes[0].id as string, body: notes[0].body as string } : null,
  }
}

export async function getItemBySlug(slug: string): Promise<Item | null> {
  const { items } = await getInventory()
  return items.find((i) => i.slug === slug) ?? null
}
