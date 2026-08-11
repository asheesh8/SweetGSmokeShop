'use client'

import { CATEGORIES, type Product } from '@/lib/products'
import { SHOP, DIRECTIONS_URL } from '@/lib/shop'
import { ProductImage } from './ProductImage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

/**
 * Quick view.
 *
 * Everything the old product page said, in a dialog — so browsing never costs
 * a navigation. The canonical `/shop/<category>/<slug>` route still exists for
 * search engines and deep links, and is offered here as a secondary link
 * rather than the only way to read the details.
 */
export function QuickView({
  product,
  onClose,
  onHold,
  isHeld,
}: {
  product: Product | null
  onClose: () => void
  onHold: (p: Product) => void
  isHeld: (slug: string) => boolean
}) {
  const p = product
  const category = p ? CATEGORIES.find((c) => c.slug === p.category) : undefined
  const held = p ? isHeld(p.slug) : false

  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto p-0 sm:max-w-3xl">
        {p && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto md:min-h-[420px]">
              <ProductImage
                slug={p.slug}
                name={p.name}
                category={category?.name ?? p.category}
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
              </div>

              <p className="mt-4 text-primary">{p.hook}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>

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

              <div className="mt-auto pt-7">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  No price listed because most of this is one-of-one or rotates weekly — we&rsquo;d
                  rather quote you honestly than publish a number that&rsquo;s wrong by the time you
                  drive over.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button onClick={() => onHold(p)} disabled={held} className="flex-1">
                    {held ? 'On your hold list ✓' : 'Hold for me'}
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
                  href={`/shop/${p.category}/${p.slug}`}
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
