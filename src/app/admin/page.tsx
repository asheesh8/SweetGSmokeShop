import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/inventory'
import { postAnnouncement, clearAnnouncement, toggleStock } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

type Snapshot = {
  total: number
  live: number
  out: number
  noPrice: number
  noPhoto: number
}

export default async function AdminHome() {
  const supabase = await createClient()
  if (!supabase) return null

  const [{ data: products }, { data: note }, { data: soldOutVariants }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, in_stock, published, price_cents, image_path, updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('announcements')
      .select('id, body, created_at')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('product_variants')
      .select('id, name, products(name, slug)')
      .eq('in_stock', false)
      .limit(12),
  ])

  const rows = products ?? []
  const snap: Snapshot = {
    total: rows.length,
    live: rows.filter((p) => p.published && p.in_stock).length,
    out: rows.filter((p) => !p.in_stock).length,
    noPrice: rows.filter((p) => p.price_cents == null).length,
    noPhoto: rows.filter((p) => !p.image_path).length,
  }

  const recent = rows.slice(0, 6)

  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow eyebrow-rule">Today</p>
        <h1 className="display mt-4 text-3xl">What&rsquo;s going on</h1>
      </div>

      {/* ── The banner. Top of the page because it's the thing that gets
             updated most often. ─────────────────────────────────────────── */}
      <section className="border border-border bg-card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display text-xl">Flavor of the day</h2>
          <p className="text-xs text-muted-foreground">
            Shows as a strip across the top of the site
          </p>
        </div>

        {note ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 border border-primary/40 bg-primary/10 px-4 py-3">
            <p className="flex-1 text-sm">{note.body}</p>
            <form action={clearAnnouncement}>
              <Button type="submit" variant="outline" size="sm">
                Take it down
              </Button>
            </form>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Nothing posted right now.</p>
        )}

        <form action={postAnnouncement} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input
            name="body"
            required
            maxLength={160}
            placeholder="FLAVOR OF THE DAY — Blue Razz, Mango Ice, Gelato. Open till 9!"
            className="flex-1"
          />
          <Button type="submit">{note ? 'Replace' : 'Post'}</Button>
        </form>
      </section>

      {/* ── Snapshot ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="eyebrow">Inventory at a glance</h2>
        <dl className="mt-4 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-5">
          {[
            { k: snap.total, v: 'Products', href: '/admin/products' },
            { k: snap.live, v: 'Live & in stock', href: '/admin/products?filter=live' },
            { k: snap.out, v: 'Out of stock', href: '/admin/products?filter=out' },
            { k: snap.noPrice, v: 'No price set', href: '/admin/products?filter=noprice' },
            { k: snap.noPhoto, v: 'No photo', href: '/admin/products?filter=nophoto' },
          ].map((s) => (
            <Link key={s.v} href={s.href} className="bg-card p-5 transition-colors hover:bg-secondary">
              <dt className="display text-3xl text-primary">{s.k}</dt>
              <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
            </Link>
          ))}
        </dl>
      </section>

      {/* ── Sold-out flavours worth clearing ───────────────────────────── */}
      {soldOutVariants && soldOutVariants.length > 0 && (
        <section className="border border-border bg-card p-6">
          <h2 className="display text-xl">Marked sold out</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These flavours are hidden from customers. Clear them when the shelf is restocked.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {soldOutVariants.map((v) => {
              const parent = v.products as unknown as { name: string; slug: string } | null
              return (
                <li
                  key={v.id}
                  className="border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
                >
                  {v.name}
                  {parent && <span className="ml-2 opacity-50">{parent.name}</span>}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* ── Recently touched ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="eyebrow">Recently edited</h2>
          <Link
            href="/admin/products"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary hover:underline"
          >
            All inventory →
          </Link>
        </div>

        <ul className="mt-4 divide-y divide-border border border-border">
          {recent.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 bg-card px-5 py-3">
              <Link href={`/admin/products/${p.id}`} className="flex-1 font-medium hover:text-primary">
                {p.name}
              </Link>
              <span className="font-mono text-[11px] text-muted-foreground">
                {formatPrice(p.price_cents)}
              </span>
              <form action={toggleStock}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="next" value={String(!p.in_stock)} />
                <Button type="submit" size="sm" variant={p.in_stock ? 'secondary' : 'outline'}>
                  {p.in_stock ? 'In stock' : 'Out'}
                </Button>
              </form>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="bg-card px-5 py-8 text-center text-sm text-muted-foreground">
              No products yet.{' '}
              <Link href="/admin/products/new" className="text-primary hover:underline">
                Add the first one
              </Link>
              .
            </li>
          )}
        </ul>
      </section>
    </div>
  )
}
