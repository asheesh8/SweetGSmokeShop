import Link from 'next/link'
import type { Cat, Item } from '@/lib/catalog'
import { formatPrice } from '@/lib/catalog'
import { ProductImage } from './ProductImage'
import { Badge } from '@/components/ui/badge'

/**
 * Linked tile for the category and product routes.
 *
 * Those pages exist for local search ("glass pipes Burlington") and deep links,
 * not as the primary way to browse — the store handles that with search,
 * filters and hold-in-place. So this stays a plain link with no client state.
 */
export function ProductTile({
  p,
  categories,
  index = 0,
}: {
  p: Item
  categories: Cat[]
  index?: number
}) {
  const category = categories.find((c) => c.slug === p.categorySlug)
  return (
    <Link href={`/shop/${p.categorySlug}/${p.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
        <ProductImage
          src={p.imageUrl}
          name={p.name}
          category={category?.name ?? p.categorySlug}
          index={index}
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
      <div className="mt-3">
        {p.brand && <p className="eyebrow">{p.brand}</p>}
        <h3 className="display mt-1 text-[15px] leading-tight sm:text-lg">{p.name}</h3>
        <p className="mt-1 font-mono text-[12px] text-primary">{formatPrice(p.priceCents)}</p>
        {p.hook && <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground sm:text-sm">{p.hook}</p>}
      </div>
    </Link>
  )
}
