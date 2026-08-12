'use client'

import type { Cat, Item } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { SHOP, DIRECTIONS_URL } from '@/lib/shop'
import { ProductImage } from './ProductImage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/**
 * Quick view.
 *
 * Everything the product page says, in a dialog — so browsing never costs a
 * navigation. The canonical route still exists for search engines and deep
 * links, offered here as a secondary link rather than the only way in.
 */
export function QuickView({
  product,
  categories,
  onClose,
  onHold,
  isHeld,
}: {
  product: Item | null
  categories: Cat[]
  onClose: () => void
  onHold: (p: Item) => void
  isHeld: (slug: string) => boolean
}) {
  const p = product
  const category = p ? categories.find((c) => c.slug === p.categorySlug) : undefined
  const held = p ? isHeld(p.slug) : false
  const flavours = p?.variants ?? []
  const available = flavours.filter((v) => v.inStock)

  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto p-0 sm:max-w-3xl">
        {p && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto md:min-h-[420px]">
              <ProductImage
                src={p.imageUrl}
                name={p.name}
                category={category?.name ?? p.categorySlug}
                index={0}
              />
            </div>

            <div className="flex flex-col p-6 md:p-8">
              <DialogHeader className="space-y-0 text-left">
                <p className="eyebrow">{category?.name}</p>
                <DialogTitle className="display mt-2 text-3xl">{p.name}</DialogTitle>
              </DialogHeader>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.brand && <Badge>{p.brand}</Badge>}
                {p.rotates && <Badge variant="secondary">Stock rotates weekly</Badge>}
                {!p.inStock && <Badge variant="outline">Out of stock</Badge>}
              </div>

              <p className="mt-4 display text-2xl text-primary">{formatPrice(p.priceCents)}</p>
              {p.hook && <p className="mt-2 text-sm text-primary/80">{p.hook}</p>}
              {p.body && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              )}

              {/* Flavour list — only the ones actually on the shelf. */}
              {available.length > 0 && (
                <div className="mt-5">
                  <p className="eyebrow">In stock today</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {available.map((v) => (
                      <li
                        key={v.id}
                        className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                      >
                        {v.name}
                        {v.priceCents != null && (
                          <span className="ml-1.5 text-primary">{formatPrice(v.priceCents)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {p.details.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {p.details.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span aria-hidden="true" className="text-primary">
                        &bull;
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-7">
                {p.priceCents == null && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    No price listed because this is one-of-one or rotates weekly — we&rsquo;d rather
                    quote you honestly than publish a number that&rsquo;s wrong by the time you
                    drive over.
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => onHold(p)} disabled={held || !p.inStock} className="flex-1">
                    {!p.inStock ? 'Out of stock' : held ? 'On your hold list ✓' : 'Hold for me'}
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={SHOP.phoneHref}>Call</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer">
                      Directions
                    </a>
                  </Button>
                </div>

                <a
                  href={`/shop/${p.categorySlug}/${p.slug}`}
                  className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-primary"
                >
                  Open full page &rarr;
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
