'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CATEGORIES, PRODUCTS, type Product } from '@/lib/products'
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

type Sort = 'featured' | 'az' | 'za' | 'category'

const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand).filter(Boolean))) as string[]

/** Everything a search should be able to match, flattened once per product. */
const HAYSTACK = new Map(
  PRODUCTS.map((p) => [
    p.slug,
    [p.name, p.hook, p.body, p.brand ?? '', p.details.join(' '), p.category]
      .join(' ')
      .toLowerCase(),
  ]),
)

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
 * navigations before you saw a single thing you could act on. Filtering,
 * searching and holding all happen in place; the quick view is a dialog, not a
 * route. The per-product routes still exist for search engines and for anyone
 * who lands on a deep link, but nothing on-site makes you walk through them.
 */
export function Store() {
  const [query, setQuery] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [rotatingOnly, setRotatingOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('featured')
  const [preview, setPreview] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Keeps typing responsive — the grid re-filters at its own pace.
  const q = useDeferredValue(query).trim().toLowerCase()

  const { add, has, setOpen } = useHoldList()

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const results = useMemo(() => {
    const terms = q.split(/\s+/).filter(Boolean)

    const out = PRODUCTS.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false
      if (brands.length && (!p.brand || !brands.includes(p.brand))) return false
      if (rotatingOnly && !p.rotates) return false
      if (!terms.length) return true
      const hay = HAYSTACK.get(p.slug) ?? ''
      // Every term must appear somewhere — narrows as you type, which is what
      // people expect from a shop search.
      return terms.every((t) => hay.includes(t))
    })

    const byName = (a: Product, b: Product) => a.name.localeCompare(b.name)
    if (sort === 'az') return [...out].sort(byName)
    if (sort === 'za') return [...out].sort((a, b) => byName(b, a))
    if (sort === 'category')
      return [...out].sort((a, b) => a.category.localeCompare(b.category) || byName(a, b))
    return out
  }, [q, cats, brands, rotatingOnly, sort])

  /** Counts reflect the other active filters, so no facet leads to zero results. */
  const catCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of PRODUCTS) {
      if (brands.length && (!p.brand || !brands.includes(p.brand))) continue
      if (rotatingOnly && !p.rotates) continue
      if (q && !(HAYSTACK.get(p.slug) ?? '').includes(q)) continue
      m.set(p.category, (m.get(p.category) ?? 0) + 1)
    }
    return m
  }, [brands, rotatingOnly, q])

  const filtersOn = cats.length > 0 || brands.length > 0 || rotatingOnly || q.length > 0
  const clearAll = () => {
    setCats([])
    setBrands([])
    setRotatingOnly(false)
    setQuery('')
  }

  const hold = (p: Product) => {
    add({ slug: p.slug, name: p.name, category: p.category })
    toast.success(`${p.name} added to your hold list`, {
      description: 'We’ll set it aside when you send the list.',
      action: { label: 'View list', onClick: () => setOpen(true) },
    })
  }

  const activeFacetCount = cats.length + brands.length + (rotatingOnly ? 1 : 0)

  const facets = (
    <>
      <div>
            <p className="eyebrow">Category</p>
            <div className="mt-2 space-y-0.5">
              {CATEGORIES.map((c) => (
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

          <div>
            <p className="eyebrow">Brand</p>
            <div className="mt-2 space-y-0.5">
              {BRANDS.map((b) => (
                <Facet
                  key={b}
                  label={b}
                  active={brands.includes(b)}
                  onClick={() => toggle(brands, setBrands, b)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Availability</p>
            <div className="mt-2">
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
    <div className="wrap grid gap-8 py-12 lg:grid-cols-[240px_1fr] lg:gap-14 lg:py-16">
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
              placeholder="Grinders, CBD, Backwoods…"
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
              <SelectTrigger id="store-sort" className="w-[168px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="az">Name A–Z</SelectItem>
                <SelectItem value="za">Name Z–A</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filter pills — always show what's narrowing the results. */}
        {(cats.length > 0 || brands.length > 0 || rotatingOnly) && (
          <div className="flex flex-wrap gap-2 pt-4">
            {cats.map((c) => (
              <Badge key={c} variant="secondary" className="gap-1.5">
                {CATEGORIES.find((x) => x.slug === c)?.name}
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
            {rotatingOnly && (
              <Badge variant="secondary" className="gap-1.5">
                Stock rotates
                <button onClick={() => setRotatingOnly(false)} aria-label="Remove availability filter">
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
          <ul className="grid grid-cols-2 gap-x-5 gap-y-9 pt-8 lg:grid-cols-3">
            {results.map((p, i) => {
              const held = has(p.slug)
              return (
                // Column layout + flex-1 on the text block so the hold button
                // sits on a common baseline no matter how the title wraps.
                <li key={p.slug} className="group flex flex-col">
                  <button
                    onClick={() => setPreview(p)}
                    className="flex w-full flex-1 flex-col text-left"
                    aria-label={`Quick view: ${p.name}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
                      <ProductImage
                        slug={p.slug}
                        name={p.name}
                        category={CATEGORIES.find((c) => c.slug === p.category)?.name ?? p.category}
                        index={i}
                        className="transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      {p.rotates && (
                        <Badge className="absolute left-3 top-3" variant="secondary">
                          Rotates
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 flex-1">
                      {p.brand && <p className="eyebrow">{p.brand}</p>}
                      <h3 className="display mt-1 text-lg leading-tight">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.hook}</p>
                    </div>
                  </button>

                  <Button
                    variant={held ? 'secondary' : 'outline'}
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => (held ? setOpen(true) : hold(p))}
                  >
                    {held ? 'On your list ✓' : 'Hold for me'}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <QuickView
        product={preview}
        onClose={() => setPreview(null)}
        onHold={(p) => hold(p)}
        isHeld={(slug) => has(slug)}
      />
    </div>
  )
}
