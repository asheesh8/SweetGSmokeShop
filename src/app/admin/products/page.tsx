import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { storageUrl } from '@/lib/supabase/config'
import { formatPrice } from '@/lib/inventory'
import { toggleStock, quickPrice } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InlinePrice } from '@/components/admin/InlinePrice'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'out', label: 'Out of stock' },
  { key: 'hidden', label: 'Hidden' },
  { key: 'noprice', label: 'No price' },
  { key: 'nophoto', label: 'No photo' },
] as const

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filter?: string }>
}) {
  const { q = '', filter = '' } = await searchParams
  const supabase = await createClient()
  if (!supabase) return null

  let query = supabase
    .from('products')
    .select('id, name, slug, brand, in_stock, published, price_cents, image_path, rotates, categories(name), product_variants(id, in_stock)')
    .order('name', { ascending: true })

  if (q) query = query.ilike('name', `%${q}%`)
  if (filter === 'live') query = query.eq('published', true).eq('in_stock', true)
  if (filter === 'out') query = query.eq('in_stock', false)
  if (filter === 'hidden') query = query.eq('published', false)
  if (filter === 'noprice') query = query.is('price_cents', null)
  if (filter === 'nophoto') query = query.is('image_path', null)

  const { data: rows } = await query

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow eyebrow-rule">Inventory</p>
          <h1 className="display mt-4 text-3xl">
            {rows?.length ?? 0} {rows?.length === 1 ? 'product' : 'products'}
          </h1>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add a product</Link>
        </Button>
      </div>

      {/* Search + filters. Both live in the URL so a filtered view can be
          bookmarked, and so the dashboard tiles can link straight into one. */}
      <div className="space-y-3">
        <form className="flex gap-2">
          {filter && <input type="hidden" name="filter" value={filter} />}
          <Input name="q" defaultValue={q} placeholder="Search by name…" className="max-w-xs" />
          <Button type="submit" variant="outline">
            Search
          </Button>
          {(q || filter) && (
            <Button asChild variant="ghost">
              <Link href="/admin/products">Clear</Link>
            </Button>
          )}
        </form>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const href = f.key ? `/admin/products?filter=${f.key}` : '/admin/products'
            const on = filter === f.key
            return (
              <Link
                key={f.label}
                href={href}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  on ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </Link>
            )
          })}
        </div>
      </div>

      <ul className="divide-y divide-border border border-border">
        {rows?.map((p) => {
          const cat = p.categories as unknown as { name: string } | null
          const variants = (p.product_variants ?? []) as { id: string; in_stock: boolean }[]
          const inStockVariants = variants.filter((v) => v.in_stock).length
          const img = storageUrl(p.image_path)

          return (
            <li key={p.id} className="flex flex-wrap items-center gap-4 bg-card p-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden border border-border bg-background">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote storage host, unknown at build time
                  <img src={img} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="plate h-full w-full" />
                )}
              </div>

              <div className="min-w-[180px] flex-1">
                <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-primary">
                  {p.name}
                </Link>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {cat?.name ?? 'Uncategorised'}
                  {p.brand ? ` · ${p.brand}` : ''}
                  {variants.length > 0 && ` · ${inStockVariants}/${variants.length} flavours`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!p.published && <Badge variant="outline">Hidden</Badge>}
                {p.rotates && <Badge variant="secondary">Rotates</Badge>}

                {/* Commits on blur or Enter — see InlinePrice. */}
                <InlinePrice id={p.id} cents={p.price_cents} label={p.name} action={quickPrice} />

                <form action={toggleStock}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="next" value={String(!p.in_stock)} />
                  <Button type="submit" size="sm" variant={p.in_stock ? 'secondary' : 'outline'}>
                    {p.in_stock ? 'In stock' : 'Out'}
                  </Button>
                </form>

                <Button asChild size="sm" variant="ghost">
                  <Link href={`/admin/products/${p.id}`}>Edit</Link>
                </Button>
              </div>
            </li>
          )
        })}

        {!rows?.length && (
          <li className="bg-card px-5 py-12 text-center">
            <p className="text-muted-foreground">Nothing matches.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">Add a product</Link>
            </Button>
          </li>
        )}
      </ul>

      <p className="text-xs text-muted-foreground">
        Prices save when you click out of the box. Everything here is live on the site the moment
        it changes.
      </p>
    </div>
  )
}
