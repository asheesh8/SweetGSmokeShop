'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, getStaffUser } from '@/lib/supabase/server'

/**
 * Every write the admin performs.
 *
 * Each one re-checks staff membership server-side. That's belt-and-braces on
 * top of the RLS policies — the database would reject a non-staff write anyway,
 * but failing here gives a clear message instead of an opaque policy error, and
 * it means a mistake in one layer isn't a hole in the system.
 */

export type ActionResult = { ok: true } | { ok: false; error: string }

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>

/**
 * Explicitly discriminated on `ok`.
 *
 * An inferred union here gives every branch an optional `error`, so `'error' in
 * ctx` narrows nothing and `ctx.error` reads as `string | undefined`. A real
 * discriminant makes the guard actually guard.
 */
type StaffCtx = { ok: false; error: string } | { ok: true; supabase: SupabaseServerClient }

async function staffClient(): Promise<StaffCtx> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, error: 'Supabase is not configured.' }
  const staff = await getStaffUser()
  if (!staff) return { ok: false, error: 'Not authorised.' }
  return { ok: true, supabase }
}

/** Refresh the storefront and the admin views a write could have changed. */
function revalidateShop() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/products')
  revalidatePath('/admin')
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

/** Dollars in the form → integer cents in the column. Blank means "ask in store". */
function parsePrice(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? '').trim().replace(/[$,]/g, '')
  if (!s) return null
  const n = Number(s)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}

/* ── Auth ─────────────────────────────────────────────────────────────────── */

export async function signIn(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  if (!supabase) return { ok: false, error: 'Supabase is not configured yet.' }

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { ok: false, error: 'Email and password are both required.' }

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }

  // Authenticating isn't authorisation — the account must also be staff.
  const staff = await getStaffUser()
  if (!staff) {
    await supabase.auth.signOut()
    return { ok: false, error: 'That account isn’t on the staff list.' }
  }

  redirect(String(formData.get('next') || '/admin'))
}

export async function signOut() {
  const supabase = await createClient()
  await supabase?.auth.signOut()
  redirect('/admin/login')
}

/* ── Products ─────────────────────────────────────────────────────────────── */

export async function saveProduct(_prev: unknown, formData: FormData): Promise<ActionResult> {
  const ctx = await staffClient()
  if (!ctx.ok) return { ok: false, error: ctx.error }

  const id = String(formData.get('id') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { ok: false, error: 'Name is required.' }

  const details = String(formData.get('details') ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const row = {
    name,
    slug: String(formData.get('slug') ?? '').trim() || slugify(name),
    category_id: String(formData.get('category_id') ?? '') || null,
    brand: String(formData.get('brand') ?? '').trim() || null,
    hook: String(formData.get('hook') ?? '').trim(),
    body: String(formData.get('body') ?? '').trim(),
    details,
    price_cents: parsePrice(formData.get('price')),
    in_stock: formData.get('in_stock') === 'on',
    rotates: formData.get('rotates') === 'on',
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    image_path: String(formData.get('image_path') ?? '').trim() || null,
  }

  const { error } = id
    ? await ctx.supabase.from('products').update(row).eq('id', id)
    : await ctx.supabase.from('products').insert(row)

  if (error) {
    // The one failure a shop owner will actually hit, in their language.
    if (error.code === '23505') return { ok: false, error: 'A product with that URL slug already exists.' }
    return { ok: false, error: error.message }
  }

  revalidateShop()
  redirect('/admin/products')
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  await ctx.supabase.from('products').delete().eq('id', String(formData.get('id')))
  revalidateShop()
  redirect('/admin/products')
}

/** One-tap in/out toggle from the product table — the most-used control here. */
export async function toggleStock(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  await ctx.supabase
    .from('products')
    .update({ in_stock: formData.get('next') === 'true' })
    .eq('id', String(formData.get('id')))
  revalidateShop()
}

export async function quickPrice(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  await ctx.supabase
    .from('products')
    .update({ price_cents: parsePrice(formData.get('price')) })
    .eq('id', String(formData.get('id')))
  revalidateShop()
}

/* ── Variants (flavours, sizes) ───────────────────────────────────────────── */

export async function addVariants(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return

  const productId = String(formData.get('product_id'))
  // Accepts a whole list at once — pasting today's flavour drop should be one
  // action, not fifteen. Newlines or commas both work.
  const names = String(formData.get('names') ?? '')
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (!names.length) return

  const price = parsePrice(formData.get('price'))
  await ctx.supabase.from('product_variants').insert(
    names.map((name, i) => ({
      product_id: productId,
      name,
      price_cents: price,
      in_stock: true,
      sort: i,
    })),
  )

  revalidateShop()
  revalidatePath(`/admin/products/${productId}`)
}

export async function toggleVariant(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  const productId = String(formData.get('product_id'))
  await ctx.supabase
    .from('product_variants')
    .update({ in_stock: formData.get('next') === 'true' })
    .eq('id', String(formData.get('id')))
  revalidateShop()
  revalidatePath(`/admin/products/${productId}`)
}

export async function deleteVariant(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  const productId = String(formData.get('product_id'))
  await ctx.supabase.from('product_variants').delete().eq('id', String(formData.get('id')))
  revalidateShop()
  revalidatePath(`/admin/products/${productId}`)
}

/** Clear every out-of-stock flavour in one go — the Monday-morning reset. */
export async function clearSoldOutVariants(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  const productId = String(formData.get('product_id'))
  await ctx.supabase
    .from('product_variants')
    .delete()
    .eq('product_id', productId)
    .eq('in_stock', false)
  revalidateShop()
  revalidatePath(`/admin/products/${productId}`)
}

/* ── Announcements ────────────────────────────────────────────────────────── */

export async function postAnnouncement(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return

  const body = String(formData.get('body') ?? '').trim()
  if (!body) return

  // Only one banner shows at a time, so retire the old one rather than
  // accumulating a pile of stale notes.
  await ctx.supabase.from('announcements').update({ active: false }).eq('active', true)
  await ctx.supabase.from('announcements').insert({ body, active: true })

  revalidateShop()
}

export async function clearAnnouncement(): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return
  await ctx.supabase.from('announcements').update({ active: false }).eq('active', true)
  revalidateShop()
}

/* ── Categories ───────────────────────────────────────────────────────────── */

export async function saveCategory(formData: FormData): Promise<void> {
  const ctx = await staffClient()
  if (!ctx.ok) return

  const name = String(formData.get('name') ?? '').trim()
  if (!name) return

  await ctx.supabase.from('categories').insert({
    name,
    slug: slugify(name),
    blurb: String(formData.get('blurb') ?? '').trim(),
    sort: 99,
  })

  revalidateShop()
  revalidatePath('/admin/categories')
}
