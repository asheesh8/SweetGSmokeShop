'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { toast } from 'sonner'
import type { Cat, Item } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { SHOP } from '@/lib/shop'
import { useHoldList } from '@/components/hold/HoldListProvider'
import { ProductImage } from './ProductImage'
import { QuickView } from './QuickView'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Sort = 'featured' | 'az' | 'za' | 'price-low' | 'price-high'

function Facet({
  label,
  active,
  onClick,
  count,
}: {
  label: string
  active: boolean
  onClick: () => void
  count?: number
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-left text-sm transition-colors ${
        active
          ? 'border-primary bg-primary/10 text-foreground'
          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="font-mono text-[10px] tabular-nums opacity-60">{count}</span>
      )}
    </button>
  )
}

/**
 * The whole shop, on one page.
 *
 * Replaces a category-page → product-page drill-down, which meant two full
 * navigations before you saw anything you could act on. Filtering, searching
 * and holding all happen in place; the quick view is a dialog, not a route.
 *
 * Data comes in as props from a Server Component so this stays a pure view —
 * it works identically against Supabase and against the static seed.
 */
export function Store({ items, categories }: { items: Item[]; categories: Cat[] }) {
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [rotatingOnly, setRotatingOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('featured')
  const [preview, setPreview] = useState<Item | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Keeps typing responsive — the grid re-filters at its own pace.
  const q = useDeferredValue(query).trim().toLowerCase()

  const { add, has, setOpen } = useHoldList()

  const brandList = useMemo(
    () => Array.from(new Set(items.map((i) => i.brand).filter(Boolean))) as string[],
    [items],
  )

  /** Everything a search should match, flattened once per item. */
  const haystack = useMemo(() => {
    const m = new Map<string, string>()
    for (const i of items) {
      m.set(
        i.slug,
        [i.name, i.hook, i.body, i.brand ?? '', i.details.join(' '), i.categorySlug,
         i.variants.map((v) => v.name).join(' ')]
          .join(' ')
          .toLowerCase(),
      )
    }
    return m
  }, [items])

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const matches = (i: Item, terms: string[]) => {
    if (cats.length && !cats.includes(i.categorySlug)) return false
    if (brands.length && (!i.brand || !brands.includes(i.brand))) return false
    if (rotatingOnly && !i.rotates) return false
    if (inStockOnly && !i.inStock) return false
    if (!terms.length) return true
    const hay = haystack.get(i.slug) ?? ''
    return terms.every((t) => hay.includes(t))
  }

  const results = useMemo(() => {
    const terms = q.split(/\s+/).filter(Boolean)
    const out = items.filter((i) => matches(i, terms))

    const byName = (a: Item, b: Item) => a.name.localeCompare(b.name)
    // Null prices sort last in both directions — "ask in store" isn't $0.
    const byPrice = (a: Item, b: Item, dir: 1 | -1) => {
      if (a.priceCents == null && b.priceCents == null) return byName(a, b)
      if (a.priceCents == null) return 1
      if (b.priceCents == null) return -1
      return (a.priceCents - b.priceCents) * dir
    }

    if (sort === 'az') return [...out].sort(byName)
    if (sort === 'za') return [...out].sort((a, b) => byName(b, a))
    if (sort === 'price-low') return [...out].sort((a, b) => byPrice(a, b, 1))
    if (sort === 'price-high') return [...out].sort((a, b) => byPrice(a, b, -1))
    return [...out].sort((a, b) => Number(b.featured) - Number(a.featured) || byName(a, b))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cats, brands, rotatingOnly, inStockOnly, sort, items, haystack])

  /** Counts reflect the *other* active filters, so no facet leads to zero. */
  const catCounts = useMemo(() => {
    const m = new Map<string, number>()
    const terms = q.split(/\s+/).filter(Boolean)
    for (const i of items) {
      if (brands.length && (!i.brand || !brands.includes(i.brand))) continue
      if (rotatingOnly && !i.rotates) continue
      if (inStockOnly && !i.inStock) continue
      if (terms.length && !terms.every((t) => (haystack.get(i.slug) ?? '').includes(t))) continue
      m.set(i.categorySlug, (m.get(i.categorySlug) ?? 0) + 1)
    }
    return m
  }, [brands, rotatingOnly, inStockOnly, q, items, haystack])

  const activeFacetCount = cats.length + brands.length + (rotatingOnly ? 1 : 0) + (inStockOnly ? 1 : 0)
  const filtersOn = activeFacetCount > 0 || q.length > 0

  const clearAll = () => {
    setCats([])
    setBrands([])
    setRotatingOnly(false)
    setInStockOnly(false)
    setQuery('')
  }

  const hold = (p: Item) => {
    add({ slug: p.slug, name: p.name, category: p.categorySlug })
    toast.success(`${p.name} added to your hold list`, {
      description: 'We’ll set it aside when you send the list.',
      action: { label: 'View list', onClick: () => setOpen(true) },
    })
  }

  const facets = (
    <>
      <div>
        <p className="eyebrow">Category</p>
        <div className="mt-2 space-y-0.5">
          {categories.map((c) => (
            <Facet
              key={c.slug}
              label={c.name}
              count={catCounts.get(c.slug) ?? 0}
              active={cats.includes(c.slug)}
              onClick={() => toggle(cats, setCats, c.slug)}
            />
          ))}
        </div>
      </div>

      {brandList.length > 0 && (
        <div>
          <p className="eyebrow">Brand</p>
          <div className="mt-2 space-y-0.5">
            {brandList.map((b) => (
              <Facet
                key={b}
                label={b}
                active={brands.includes(b)}
                onClick={() => toggle(brands, setBrands, b)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="eyebrow">Availability</p>
        <div className="mt-2 space-y-0.5">
          <Facet
            label="In stock only"
            active={inStockOnly}
            onClick={() => setInStockOnly((v) => !v)}
          />
          <Facet
            label="Stock rotates weekly"
            active={rotatingOnly}
            onClick={() => setRotatingOnly((v) => !v)}
          />
        </div>
      </div>

      {filtersOn && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
          Clear all filters
        </Button>
      )}

      <div className="rounded-[var(--radius-sm)] border border-border p-4">
        <p className="eyebrow">Can&rsquo;t find it?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The cases change weekly. Call and we&rsquo;ll tell you what&rsquo;s in today.
        </p>
        <a
          href={SHOP.phoneHref}
          className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:underline"
        >
          {SHOP.phone}
        </a>
      </div>
    </>
  )

  return (
    <div className="wrap grid gap-8 py-10 lg:grid-cols-[240px_1fr] lg:gap-14 lg:py-16">
      {/* ── Filter rail (desktop) ──────────────────────────── */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <div className="space-y-8">
          <div>
            <label htmlFor="store-search" className="eyebrow">
              Search
            </label>
            <Input
              id="store-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Grinders, CBD, Blue Razz…"
              className="mt-2"
            />
          </div>
          {facets}
        </div>
      </aside>

      {/* ── Results ────────────────────────────────────────── */}
      <div>
        {/* Mobile controls. The full rail stacked above the grid pushed the
            first product below two screens of filters — search stays visible
            because it's the fastest path, the facets collapse. */}
        <div className="mb-6 lg:hidden">
          <div className="flex gap-2">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the shop…"
              aria-label="Search the shop"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              Filters{activeFacetCount > 0 ? ` (${activeFacetCount})` : ''}
            </Button>
          </div>
          {showFilters && <div className="mt-6 space-y-8 border-t border-border pt-6">{facets}</div>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-mono tabular-nums text-foreground">{results.length}</span>{' '}
            {results.length === 1 ? 'item' : 'items'}
            {filtersOn && ' matching'}
          </p>

          <div className="flex items-center gap-3">
            <label htmlFor="store-sort" className="eyebrow hidden sm:block">
              Sort
            </label>
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger id="store-sort" className="w-[150px] sm:w-[168px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="az">Name A–Z</SelectItem>
                <SelectItem value="za">Name Z–A</SelectItem>
                <SelectItem value="price-low">Price: low to high</SelectItem>
                <SelectItem value="price-high">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeFacetCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {cats.map((c) => (
              <Badge key={c} variant="secondary" className="gap-1.5">
                {categories.find((x) => x.slug === c)?.name ?? c}
                <button onClick={() => toggle(cats, setCats, c)} aria-label={`Remove ${c} filter`}>
                  ×
                </button>
              </Badge>
            ))}
            {brands.map((b) => (
              <Badge key={b} variant="secondary" className="gap-1.5">
                {b}
                <button onClick={() => toggle(brands, setBrands, b)} aria-label={`Remove ${b} filter`}>
                  ×
                </button>
              </Badge>
            ))}
            {inStockOnly && (
              <Badge variant="secondary" className="gap-1.5">
                In stock
                <button onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                  ×
                </button>
              </Badge>
            )}
            {rotatingOnly && (
              <Badge variant="secondary" className="gap-1.5">
                Stock rotates
                <button onClick={() => setRotatingOnly(false)} aria-label="Remove rotates filter">
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="display text-2xl">Nothing matches that</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              We carry a lot that isn&rsquo;t listed here yet — the cases turn over weekly. Call{' '}
              {SHOP.phone} and just ask.
            </p>
            <Button variant="outline" onClick={clearAll} className="mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-x-3 gap-y-7 pt-6 sm:gap-x-5 sm:gap-y-9 sm:pt-8 lg:grid-cols-3">
            {results.map((p, i) => {
              const held = has(p.slug)
              const inStockFlavours = p.variants.filter((v) => v.inStock).length
              return (
                <li key={p.slug} className="group flex flex-col">
                  <button
                    onClick={() => setPreview(p)}
                    className="flex w-full flex-1 flex-col text-left"
                    aria-label={`Quick view: ${p.name}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
                      <ProductImage
                        src={p.imageUrl}
                        name={p.name}
                        category={categories.find((c) => c.slug === p.categorySlug)?.name ?? p.categorySlug}
                        index={i}
                        className={`transition-transform duration-500 group-hover:scale-[1.04] ${
                          p.inStock ? '' : 'opacity-50 grayscale'
                        }`}
                      />
                      {!p.inStock ? (
                        <Badge className="absolute left-3 top-3" variant="outline">
                          Out of stock
                        </Badge>
                      ) : (
                        p.rotates && (
                          <Badge className="absolute left-3 top-3" variant="secondary">
                            Rotates
                          </Badge>
                        )
                      )}
                    </div>

                    <div className="mt-3 flex-1">
                      {p.brand && <p className="eyebrow">{p.brand}</p>}
                      <h3 className="display mt-1 text-[15px] leading-tight sm:text-lg">{p.name}</h3>
                      <p className="mt-1 font-mono text-[12px] text-primary">
                        {formatPrice(p.priceCents)}
                      </p>
                      {inStockFlavours > 0 && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                          {inStockFlavours} flavours in
                        </p>
                      )}
                      {p.hook && (
                        <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground sm:text-sm">{p.hook}</p>
                      )}
                    </div>
                  </button>

                  <Button
                    variant={held ? 'secondary' : 'outline'}
                    size="sm"
                    className="mt-3 w-full"
                    disabled={!p.inStock}
                    onClick={() => (held ? setOpen(true) : hold(p))}
                  >
                    {!p.inStock ? 'Out of stock' : held ? 'On your list ✓' : 'Hold for me'}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <QuickView
        product={preview}
        categories={categories}
        onClose={() => setPreview(null)}
        onHold={hold}
        isHeld={has}
      />
    </div>
  )
}
